const { openAIRequestManager, logger } = require('../utils/openaiManager');

/**
 * Middleware to handle chatbot requests with rate limiting
 */
const chatbotMiddleware = {
  /**
   * Process a chat message with rate limiting and error handling
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async processChatMessage(req, res, next) {
    const startTime = Date.now();
    const requestId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const { message, user, conversationHistory = [], category, selectedLanguage = 'en' } = req.body;

      // Validate request
      if (!message) {
        return res.status(400).json({ 
          error: 'Message is required',
          requestId 
        });
      }

      // Log request
      logger.info('Processing chat message', {
        requestId,
        userId: user?.id || 'anonymous',
        messageLength: message.length,
        category: category?.id,
        language: selectedLanguage,
        conversationHistoryLength: conversationHistory.length
      });

      // Prepare OpenAI request
      const systemPrompt = category 
        ? (selectedLanguage === 'ar' ? category.systemPromptAr : category.systemPrompt)
        : `You are an intelligent assistant for the Iomad Learning Management System. You must respond in ${selectedLanguage === 'ar' ? 'Arabic' : 'English'}.`;

      const languageInstruction = selectedLanguage === 'ar'
        ? '\n\nمهم: يجب أن تجيب دائماً باللغة العربية، حتى لو كان سؤال المستخدم باللغة الإنجليزية.'
        : '\n\nImportant: You must always respond in English, even if the user asks in Arabic.';

      const messages = [
        {
          role: 'system',
          content: systemPrompt + languageInstruction
        },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const openAIRequestData = {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      };

      // Send request through rate limiter
      const openAIResponse = await openAIRequestManager.sendRequest(openAIRequestData, requestId);
      
      const assistantMessage = openAIResponse.choices[0]?.message?.content;

      if (!assistantMessage) {
        throw new Error('No response from OpenAI');
      }

      // Parse action and fetch data if needed
      const action = parseActionFromResponse(assistantMessage, selectedLanguage);
      let data = null;
      
      if (action && action !== 'none') {
        try {
          data = await fetchDataForAction(action);
        } catch (dataError) {
          logger.warn('Failed to fetch data for action', {
            requestId,
            action,
            error: dataError.message
          });
        }
      }

      const responseTime = Date.now() - startTime;
      
      logger.info('Chat message processed successfully', {
        requestId,
        responseTime,
        action,
        hasData: !!data
      });

      res.json({
        message: assistantMessage,
        data,
        language: selectedLanguage,
        action: action || 'none',
        requestId,
        responseTime
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      logger.error('Chat message processing failed', {
        requestId,
        error: error.message,
        responseTime,
        stack: error.stack
      });

      // Enhanced error handling with graceful messages
      const selectedLanguage = req.body.selectedLanguage || 'en';
      let errorResponse = null;
      
      if (error.message.includes('Many users are asking right now')) {
        // This is our graceful rate limit message
        errorResponse = {
          message: selectedLanguage === 'ar' 
            ? 'يسأل العديد من المستخدمين الآن. يرجى المحاولة مرة أخرى خلال لحظات.'
            : 'Many users are asking right now. Please try again in a few moments.',
          data: null,
          language: selectedLanguage,
          action: 'none',
          requestId,
          responseTime,
          graceful: true
        };
      } else if (error.message.includes('Rate limit')) {
        errorResponse = {
          message: selectedLanguage === 'ar' 
            ? 'الخدمة مشغولة حالياً. يرجى المحاولة مرة أخرى خلال دقيقة.'
            : 'Service is busy right now. Please try again in a moment.',
          data: null,
          language: selectedLanguage,
          action: 'none',
          requestId,
          responseTime,
          retryAfter: 60,
          graceful: true
        };
        return res.status(429).json(errorResponse);
      } else if (error.message.includes('temporarily unavailable')) {
        errorResponse = {
          message: selectedLanguage === 'ar' 
            ? 'خدمة الذكاء الاصطناعي غير متاحة مؤقتاً. يرجى المحاولة لاحقاً.'
            : 'The AI service is temporarily unavailable. Please try again later.',
          data: null,
          language: selectedLanguage,
          action: 'none',
          requestId,
          responseTime,
          graceful: true
        };
      } else if (error.message.includes('temporarily slow')) {
        errorResponse = {
          message: selectedLanguage === 'ar' 
            ? 'خدمة الذكاء الاصطناعي بطيئة مؤقتاً. يرجى المحاولة مرة أخرى.'
            : 'The AI service is temporarily slow. Please try again.',
          data: null,
          language: selectedLanguage,
          action: 'none',
          requestId,
          responseTime,
          graceful: true
        };
      } else if (error.message.includes('Invalid API key') || error.message.includes('being configured')) {
        logger.warn('API key issue detected, using fallback response');
        errorResponse = {
          message: selectedLanguage === 'ar' 
            ? 'خدمة الذكاء الاصطناعي قيد الإعداد حالياً. يرجى المحاولة لاحقاً.'
            : 'The AI service is currently being configured. Please try again later.',
          data: null,
          language: selectedLanguage,
          action: 'none',
          requestId,
          responseTime,
          fallback: true
        };
      } else if (error.message.includes('timeout') || error.message.includes('Network error')) {
        errorResponse = {
          message: selectedLanguage === 'ar' 
            ? 'يبدو أن الاتصال بطيء. يرجى المحاولة مرة أخرى.'
            : 'Connection seems slow. Please try again.',
          data: null,
          language: selectedLanguage,
          action: 'none',
          requestId,
          responseTime,
          graceful: true
        };
        return res.status(503).json(errorResponse);
      }
      
      // If we have a graceful error response, use it
      if (errorResponse) {
        return res.json(errorResponse);
      }

      // Final fallback to mock response for unexpected errors
      const fallbackResponse = getMockResponse(req.body.message, req.body.category, selectedLanguage);
      
      res.json({
        ...fallbackResponse,
        requestId,
        responseTime,
        fallback: true,
        note: 'Using fallback response due to temporary service issue'
      });
    }
  },

  /**
   * Get queue status endpoint
   */
  async getQueueStatus(req, res) {
    try {
      const status = openAIRequestManager.getStatus();
      res.json(status);
    } catch (error) {
      logger.error('Failed to get queue status', { error: error.message });
      res.status(500).json({ error: 'Failed to get queue status' });
    }
  },

  /**
   * Health check endpoint
   */
  async healthCheck(req, res) {
    try {
      const status = openAIRequestManager.getStatus();
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        queue: status.queue,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      };
      
      res.json(health);
    } catch (error) {
      logger.error('Health check failed', { error: error.message });
      res.status(500).json({ 
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Helper functions (moved from chatbotRoutes.js)
function parseActionFromResponse(response, language) {
  const lowerResponse = response.toLowerCase();
  const lowerLanguage = language.toLowerCase();
  
  if (lowerLanguage === 'ar') {
    if (lowerResponse.includes('دورات') || lowerResponse.includes('courses')) {
      return 'fetch_courses';
    }
    if (lowerResponse.includes('مدارس') || lowerResponse.includes('schools')) {
      return 'fetch_schools';
    }
    if (lowerResponse.includes('مستخدمين') || lowerResponse.includes('users')) {
      return 'fetch_users';
    }
  } else {
    if (lowerResponse.includes('courses') || lowerResponse.includes('available')) {
      return 'fetch_courses';
    }
    if (lowerResponse.includes('schools')) {
      return 'fetch_schools';
    }
    if (lowerResponse.includes('users')) {
      return 'fetch_users';
    }
  }
  
  return 'none';
}

async function fetchDataForAction(action) {
  // Implementation for fetching data based on action
  // This would call your Iomad API functions
  try {
    switch (action) {
      case 'fetch_courses':
        return await callIomadAPI('core_course_get_courses');
      case 'fetch_schools':
        return await callIomadAPI('core_course_get_categories');
      case 'fetch_users':
        return await callIomadAPI('core_user_get_users');
      default:
        return null;
    }
  } catch (error) {
    logger.error('Failed to fetch data for action', { action, error: error.message });
    return null;
  }
}

function getMockResponse(message, category, language) {
  const lowerMessage = message.toLowerCase();

  if (language === 'ar') {
    if (lowerMessage.includes('دورات') || lowerMessage.includes('courses')) {
      return {
        message: 'هناك العديد من الدورات المتاحة في النظام. يمكنني مساعدتك في العثور على الدورات المناسبة لاحتياجاتك.',
        data: null,
        language: 'ar',
        action: 'fetch_courses'
      };
    }
    return {
      message: 'مرحباً! كيف يمكنني مساعدتك اليوم؟ يمكنني مساعدتك في العثور على الدورات والمدارس والمستخدمين.',
      data: null,
      language: 'ar',
      action: 'none'
    };
  } else {
    if (lowerMessage.includes('courses') || lowerMessage.includes('available')) {
      return {
        message: 'There are many courses available in the system. I can help you find courses that match your needs.',
        data: null,
        language: 'en',
        action: 'fetch_courses'
      };
    }
    return {
      message: 'Hello! How can I help you today? I can help you find courses, schools, and users.',
      data: null,
      language: 'en',
      action: 'none'
    };
  }
}

// Iomad API helper function (placeholder - implement based on your actual API)
async function callIomadAPI(functionName, params = {}) {
  // This is a placeholder - implement your actual Iomad API calls here
  logger.info('Calling Iomad API', { functionName, params });
  
  // Mock response for demonstration
  return [
    { id: 1, name: 'Sample Course 1' },
    { id: 2, name: 'Sample Course 2' }
  ];
}

module.exports = chatbotMiddleware; 