import axios from 'axios';
import { User, Course, School, ChatCategory, ChatMessage } from '../types';
import { chatCategories } from '../data/chatCategories';

// Backend API Configuration
const BACKEND_API_URL = 'http://localhost:3002/api/chatbot';

// OpenAI API Configuration (for direct calls if needed)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Iomad API Configuration
const IOMAD_API_URL = 'https://iomad.bylinelms.com/webservice/rest/server.php';
const IOMAD_TOKEN = '4a2ba2d6742afc7d13ce4cf486ba7633';

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

// Enhanced chatbot function with category support - now calls backend
export const processCategoryChatMessage = async (
  userMessage: string,
  category: ChatCategory,
  user: User | null,
  conversationHistory: ChatMessage[] = [],
  selectedLanguage: 'en' | 'ar' = 'en'
): Promise<ChatbotResponse> => {
  try {
    // Call our backend API instead of OpenAI directly
    const response = await axios.post(`${BACKEND_API_URL}/chat`, {
      message: userMessage,
      user: user,
      conversationHistory: conversationHistory,
      category: category,
      selectedLanguage: selectedLanguage
    });

    return response.data;
  } catch (error) {
    console.error('Backend API Error:', error);
    
    // Fallback error message
    const errorMessage = selectedLanguage === 'ar' 
      ? 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.'
      : 'Sorry, there was an error processing your request. Please try again.';
    
    return {
      message: errorMessage,
      language: selectedLanguage,
      action: 'none'
    };
  }
}; 