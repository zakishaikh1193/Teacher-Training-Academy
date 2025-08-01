import axios from 'axios';
import { User, Course, School, ChatCategory } from '../types';

// OpenAI API Configuration
const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Iomad API Configuration
const IOMAD_API_URL = 'https://iomad.bylinelms.com/webservice/rest/server.php';
const IOMAD_TOKEN = '4a2ba2d6742afc7d13ce4cf486ba7633';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  language: 'en' | 'ar';
}

export interface ChatbotResponse {
  message: string;
  data?: any;
  language: 'en' | 'ar';
  action?: 'fetch_courses' | 'fetch_schools' | 'fetch_users' | 'fetch_analytics' | 'none';
}

// Language detection function
export const detectLanguage = (text: string): 'en' | 'ar' => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text) ? 'ar' : 'en';
};

// Iomad API helper functions
const callIomadAPI = async (wsfunction: string, params: Record<string, any> = {}) => {
  const requestParams = new URLSearchParams({
    wstoken: IOMAD_TOKEN,
    wsfunction,
    moodlewsrestformat: 'json',
    ...params
  });

  try {
    const response = await axios.post(IOMAD_API_URL, requestParams);
    return response.data;
  } catch (error) {
    console.error('Iomad API Error:', error);
    throw new Error('Failed to fetch data from Iomad');
  }
};

// Fetch courses from Iomad
export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const data = await callIomadAPI('core_course_get_courses_by_field');
    
    if (data && typeof data === 'object' && 'exception' in data) {
      throw new Error(`Iomad API Error: ${data.errorcode || ''} - ${data.message || 'Unknown error'}`);
    }

    if (!data || !Array.isArray(data.courses)) {
      return [];
    }

    return data.courses.map((course: any) => ({
      id: course.id,
      fullname: course.fullname,
      shortname: course.shortname,
      summary: course.summary,
      visible: course.visible,
      categoryid: course.categoryid,
      categoryname: course.categoryname,
      startdate: course.startdate,
      enddate: course.enddate,
      courseimage: course.courseimage || (course.overviewfiles && course.overviewfiles[0]?.fileurl),
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Fetch schools/companies from Iomad
export const fetchSchools = async (): Promise<School[]> => {
  try {
    const data = await callIomadAPI('block_iomad_company_admin_get_companies');
    return data.companies || [];
  } catch (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
};

// Fetch users from Iomad
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const data = await callIomadAPI('core_user_get_users');
    return data.users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Main chatbot function
export const processChatMessage = async (
  userMessage: string,
  user: User | null,
  conversationHistory: ChatMessage[] = []
): Promise<ChatbotResponse> => {
  const language = detectLanguage(userMessage);
  
  // Create system prompt based on user role
  const roleBasedPrompt = user ? getRoleBasedPrompt(user, language) : getDefaultPrompt(language);
  
  // Prepare conversation history for OpenAI
  const messages = [
    {
      role: 'system' as const,
      content: roleBasedPrompt
    },
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })),
    {
      role: 'user' as const,
      content: userMessage
    }
  ];

  try {
    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-4',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const assistantMessage = response.data.choices[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('No response from OpenAI');
    }

    // Parse the response to determine if we need to fetch data
    const action = parseActionFromResponse(assistantMessage, language);
    
    let data = null;
    if (action && action !== 'none') {
      data = await fetchDataForAction(action);
    }

    return {
      message: assistantMessage,
      data,
      language,
      action: action || 'none'
    };

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    const errorMessage = language === 'ar' 
      ? 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.'
      : 'Sorry, there was an error processing your request. Please try again.';
    
    return {
      message: errorMessage,
      language,
      action: 'none'
    };
  }
};

// Helper function to get role-based prompt
const getRoleBasedPrompt = (user: User, language: 'en' | 'ar'): string => {
  const role = user.role || 'trainee';
  
  if (language === 'ar') {
    return `أنت مساعد ذكي لنظام إدارة التعلم Iomad. يجب أن تجيب باللغة العربية دائماً.

معلومات المستخدم:
- الدور: ${getArabicRoleName(role)}
- الاسم: ${user.firstname} ${user.lastname}
- المدرسة: ${user.schoolName || 'غير محدد'}

قدراتك:
1. الإجابة على أسئلة حول الدورات والمدارس والمستخدمين
2. تقديم تقارير وتحليلات حسب دور المستخدم
3. مساعدة في إدارة النظام (للمدراء)
4. توجيه الطلاب والمعلمين

إذا طلب المستخدم بيانات محددة، استخدم هذه الوظائف:
- "fetch_courses" للحصول على قائمة الدورات
- "fetch_schools" للحصول على قائمة المدارس  
- "fetch_users" للحصول على قائمة المستخدمين
- "fetch_analytics" للحصول على التحليلات

أجب دائماً باللغة العربية وكن مفيداً ومهذباً.`;
  }

  return `You are an intelligent assistant for the Iomad Learning Management System. You must respond in English.

User Information:
- Role: ${role}
- Name: ${user.firstname} ${user.lastname}
- School: ${user.schoolName || 'Not specified'}

Your capabilities:
1. Answer questions about courses, schools, and users
2. Provide reports and analytics based on user role
3. Help with system administration (for admins)
4. Guide students and teachers

If the user requests specific data, use these functions:
- "fetch_courses" to get list of courses
- "fetch_schools" to get list of schools
- "fetch_users" to get list of users
- "fetch_analytics" to get analytics

Always respond in English and be helpful and polite.`;
};

// Helper function to get default prompt
const getDefaultPrompt = (language: 'en' | 'ar'): string => {
  if (language === 'ar') {
    return `أنت مساعد ذكي لنظام إدارة التعلم Iomad. يجب أن تجيب باللغة العربية دائماً.

يمكنك مساعدة المستخدمين في:
- البحث عن الدورات والمدارس
- تقديم معلومات عامة عن النظام
- الإجابة على الأسئلة الشائعة

أجب دائماً باللغة العربية وكن مفيداً ومهذباً.`;
  }

  return `You are an intelligent assistant for the Iomad Learning Management System. You must respond in English.

You can help users with:
- Searching for courses and schools
- Providing general system information
- Answering common questions

Always respond in English and be helpful and polite.`;
};

// Helper function to get Arabic role names
const getArabicRoleName = (role: string): string => {
  const roleMap: Record<string, string> = {
    'admin': 'مدير النظام',
    'school_admin': 'مدير المدرسة',
    'cluster_admin': 'مدير المجمع',
    'trainer': 'مدرب',
    'teacher': 'معلم',
    'trainee': 'متدرب',
    'principal': 'مدير المدرسة'
  };
  return roleMap[role] || 'مستخدم';
};

// Parse action from OpenAI response
const parseActionFromResponse = (response: string, language: 'en' | 'ar'): 'fetch_courses' | 'fetch_schools' | 'fetch_users' | 'fetch_analytics' | 'none' | null => {
  const lowerResponse = response.toLowerCase();
  
  if (language === 'ar') {
    if (lowerResponse.includes('دورات') || lowerResponse.includes('courses')) return 'fetch_courses';
    if (lowerResponse.includes('مدارس') || lowerResponse.includes('schools')) return 'fetch_schools';
    if (lowerResponse.includes('مستخدمين') || lowerResponse.includes('users')) return 'fetch_users';
    if (lowerResponse.includes('تحليلات') || lowerResponse.includes('analytics')) return 'fetch_analytics';
  } else {
    if (lowerResponse.includes('courses')) return 'fetch_courses';
    if (lowerResponse.includes('schools')) return 'fetch_schools';
    if (lowerResponse.includes('users')) return 'fetch_users';
    if (lowerResponse.includes('analytics')) return 'fetch_analytics';
  }
  
  return null;
};

// Fetch data based on action
const fetchDataForAction = async (action: string): Promise<any> => {
  switch (action) {
    case 'fetch_courses':
      return await fetchCourses();
    case 'fetch_schools':
      return await fetchSchools();
    case 'fetch_users':
      return await fetchUsers();
    case 'fetch_analytics':
      return {
        totalCourses: 0,
        totalSchools: 0,
        totalUsers: 0
      };
    default:
      return null;
  }
}; 