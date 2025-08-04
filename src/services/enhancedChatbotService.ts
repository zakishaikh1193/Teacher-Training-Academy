import axios from 'axios';
import { User, Course, School, ChatCategory, ChatMessage } from '../types';
import { chatCategories } from '../data/chatCategories';

// Backend API Configuration
const BACKEND_API_URL = 'http://localhost:3002/api/chatbot';

// Iomad API Configuration
const IOMAD_API_URL = 'https://iomad.bylinelms.com/webservice/rest/server.php';
const IOMAD_TOKEN = '4a2ba2d6742afc7d13ce4cf486ba7633';

// Language detection function
export const detectLanguage = (text: string): 'en' | 'ar' => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text) ? 'ar' : 'en';
};

// Get category by ID
export const getCategoryById = (id: string): ChatCategory | undefined => {
  return chatCategories.find(category => category.id === id);
};

// Get all categories
export const getAllCategories = (): ChatCategory[] => {
  return chatCategories;
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

export interface ChatbotResponse {
  message: string;
  data?: any;
  language: 'en' | 'ar';
  action?: 'fetch_courses' | 'fetch_schools' | 'fetch_users' | 'fetch_analytics' | 'none';
  requestId?: string;
  responseTime?: number;
  fallback?: boolean;
  graceful?: boolean;
}

export const processCategoryChatMessage = async (
  userMessage: string,
  category: ChatCategory,
  user: User | null,
  conversationHistory: ChatMessage[] = [],
  selectedLanguage: 'en' | 'ar' = 'en'
): Promise<ChatbotResponse> => {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Sending request to backend:', {
      message: userMessage.substring(0, 50) + '...',
      category: category.id,
      language: selectedLanguage,
      conversationHistoryLength: conversationHistory.length,
      timestamp: new Date().toISOString()
    });

    const response = await axios.post(`${BACKEND_API_URL}/chat`, {
      message: userMessage,
      user: user,
      conversationHistory: conversationHistory,
      category: category,
      selectedLanguage: selectedLanguage
    }, {
      timeout: 90000, // Increased to 90 seconds to accommodate retries
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const requestTime = Date.now() - startTime;
    
    console.log('✅ Backend response received:', {
      messageLength: response.data.message?.length || 0,
      hasData: !!response.data.data,
      action: response.data.action,
      requestId: response.data.requestId,
      responseTime: response.data.responseTime,
      frontendRequestTime: `${requestTime}ms`,
      graceful: response.data.graceful || false
    });

    return response.data;
  } catch (error: any) {
    const requestTime = Date.now() - startTime;
    
    console.error('❌ Backend API Error:', {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      requestId: error.response?.data?.requestId,
      frontendRequestTime: `${requestTime}ms`,
      errorCode: error.code,
      timestamp: new Date().toISOString()
    });

    // Handle specific error types with enhanced messages
    if (error.response?.status === 401) {
      const message = selectedLanguage === 'ar'
        ? 'فشل في المصادقة. يرجى التحقق من إعدادات API.'
        : 'Authentication failed. Please check your API configuration.';
      return { message, language: selectedLanguage, action: 'none' };
    } 
    
    if (error.response?.status === 429) {
      // If backend sent a graceful rate limit message, use it
      if (error.response?.data?.graceful && error.response?.data?.message) {
        return {
          message: error.response.data.message,
          language: selectedLanguage,
          action: 'none',
          graceful: true
        };
      }
      const message = selectedLanguage === 'ar'
        ? 'يسأل العديد من المستخدمين الآن. يرجى المحاولة مرة أخرى خلال لحظات.'
        : 'Many users are asking right now. Please try again in a few moments.';
      return { message, language: selectedLanguage, action: 'none' };
    } 
    
    if (error.response?.status === 503) {
      const message = selectedLanguage === 'ar'
        ? 'الخدمة غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى.'
        : 'Service temporarily unavailable. Please try again.';
      return { message, language: selectedLanguage, action: 'none' };
    } 
    
    if (error.code === 'ECONNABORTED') {
      const message = selectedLanguage === 'ar'
        ? 'انتهت مهلة الطلب. يبدو أن الخدمة مشغولة، يرجى المحاولة مرة أخرى.'
        : 'Request took too long. The service seems busy, please try again.';
      return { message, language: selectedLanguage, action: 'none' };
    } 
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      const message = selectedLanguage === 'ar'
        ? 'غير قادر على الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.'
        : 'Unable to connect to server. Please check your internet connection.';
      return { message, language: selectedLanguage, action: 'none' };
    }

    // If backend sent a graceful error message, use it
    if (error.response?.data?.graceful && error.response?.data?.message) {
      return {
        message: error.response.data.message,
        language: selectedLanguage,
        action: 'none',
        graceful: true
      };
    }

    // Default fallback message
    const errorMessage = selectedLanguage === 'ar'
      ? 'عذراً، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى خلال لحظات.'
      : 'Sorry, there was a temporary issue. Please try again in a few moments.';

    return {
      message: errorMessage,
      language: selectedLanguage,
      action: 'none',
      fallback: true
    };
  }
}; 