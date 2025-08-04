const axios = require('axios');
const Bottleneck = require('bottleneck');
const winston = require('winston');
const cron = require('node-cron');
const fs = require('fs').promises;

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'openai-manager' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// OpenAI API Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_BILLING_USAGE_URL = 'https://api.openai.com/v1/dashboard/billing/usage';
const OPENAI_BILLING_SUBSCRIPTION_URL = 'https://api.openai.com/v1/dashboard/billing/subscription';

// Enhanced validation for API key
function validateApiKey() {
  if (!OPENAI_API_KEY) {
    logger.error('❌ OPENAI_API_KEY is not set in environment variables');
    throw new Error('OpenAI API key not configured');
  }
  
  if (!OPENAI_API_KEY.startsWith('sk-')) {
    logger.error('❌ Invalid OpenAI API key format');
    throw new Error('Invalid OpenAI API key format');
  }
  
  if (OPENAI_API_KEY.includes('sk-proj-')) {
    logger.info('✅ Using paid OpenAI API key (project-based)');
  } else if (OPENAI_API_KEY.length > 50) {
    logger.info('✅ Using paid OpenAI API key');
  } else {
    logger.warn('⚠️ API key appears to be from free tier');
  }
  
  // Check for multiple keys in environment
  const envContent = process.env;
  const possibleKeys = Object.keys(envContent).filter(key => 
    key.includes('OPENAI') && key.includes('KEY')
  );
  
  if (possibleKeys.length > 1) {
    logger.warn('⚠️ Multiple OpenAI keys detected in environment:', possibleKeys);
  }
  
  return true;
}

// Quota and subscription checking
async function checkQuotaAndSubscription() {
  try {
    logger.info('🔍 Checking OpenAI quota and subscription...');
    
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const headers = {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    };
    
    // Check usage
    const usageParams = {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    };
    
    const [usageResponse, subscriptionResponse] = await Promise.allSettled([
      axios.get(OPENAI_BILLING_USAGE_URL, { 
        headers, 
        params: usageParams,
        timeout: 10000 
      }),
      axios.get(OPENAI_BILLING_SUBSCRIPTION_URL, { 
        headers,
        timeout: 10000 
      })
    ]);
    
    let quotaInfo = {
      timestamp: new Date().toISOString(),
      usage: null,
      subscription: null,
      warnings: []
    };
    
    // Process usage data
    if (usageResponse.status === 'fulfilled') {
      const usage = usageResponse.value.data;
      quotaInfo.usage = {
        totalUsage: usage.total_usage || 0,
        dailyUsage: usage.daily_costs || [],
        currentMonth: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0]
        }
      };
      
      logger.info('📊 Current OpenAI usage:', {
        totalUsage: quotaInfo.usage.totalUsage,
        period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`
      });
    } else {
      logger.warn('⚠️ Could not fetch usage data:', usageResponse.reason?.message);
      quotaInfo.warnings.push('Usage data unavailable');
    }
    
    // Process subscription data
    if (subscriptionResponse.status === 'fulfilled') {
      const subscription = subscriptionResponse.value.data;
      quotaInfo.subscription = {
        hasPaymentMethod: subscription.has_payment_method,
        softLimit: subscription.soft_limit_usd,
        hardLimit: subscription.hard_limit_usd,
        systemHardLimit: subscription.system_hard_limit_usd,
        accessUntil: subscription.access_until
      };
      
      logger.info('💳 OpenAI subscription info:', {
        hasPaymentMethod: quotaInfo.subscription.hasPaymentMethod,
        softLimit: quotaInfo.subscription.softLimit,
        hardLimit: quotaInfo.subscription.hardLimit
      });
      
      // Check for quota warnings
      if (quotaInfo.usage && quotaInfo.subscription.softLimit) {
        const usagePercentage = (quotaInfo.usage.totalUsage / quotaInfo.subscription.softLimit) * 100;
        
        if (usagePercentage >= 90) {
          logger.error('🚨 CRITICAL: OpenAI usage at 90%+ of quota!');
          quotaInfo.warnings.push('Usage critical (90%+)');
        } else if (usagePercentage >= 80) {
          logger.warn('⚠️ WARNING: OpenAI usage at 80%+ of quota');
          quotaInfo.warnings.push('Usage high (80%+)');
        } else if (usagePercentage >= 50) {
          logger.info('📈 OpenAI usage at 50%+ of quota');
        }
      }
      
    } else {
      logger.warn('⚠️ Could not fetch subscription data:', subscriptionResponse.reason?.message);
      quotaInfo.warnings.push('Subscription data unavailable');
    }
    
    return quotaInfo;
    
  } catch (error) {
    logger.error('❌ Failed to check OpenAI quota:', error.message);
    return {
      timestamp: new Date().toISOString(),
      error: error.message,
      warnings: ['Quota check failed']
    };
  }
}

// Enhanced Rate Limiting Configuration
const RATE_LIMIT_CONFIG = {
  // OpenAI's rate limits (adjust based on your plan)
  requestsPerMinute: 60, // Free tier: 3, Paid: 60-3500
  requestsPerHour: 3500,
  
  // Enhanced retry configuration with exponential backoff (2s, 4s, 8s)
  maxRetries: 3,
  retryDelays: [2000, 4000, 8000], // Specific delays as requested
  
  // Queue configuration
  maxConcurrent: 5,
  minTime: 200, // Minimum time between requests (ms)
  
  // Backoff strategy for general delays
  backoffMultiplier: 2,
  jitter: 0.1 // Add 10% jitter to avoid thundering herd
};

// Create rate limiter using Bottleneck
const limiter = new Bottleneck({
  maxConcurrent: RATE_LIMIT_CONFIG.maxConcurrent,
  minTime: RATE_LIMIT_CONFIG.minTime,
  
  // Reservoir for rate limiting
  reservoir: RATE_LIMIT_CONFIG.requestsPerMinute,
  reservoirRefreshAmount: RATE_LIMIT_CONFIG.requestsPerMinute,
  reservoirRefreshInterval: 60 * 1000, // 1 minute
});

// Enhanced Request Manager for OpenAI with comprehensive error handling
class OpenAIRequestManager {
  constructor() {
    this.requestQueue = [];
    this.isProcessing = false;
    this.concurrentRequests = 0;
    this.lastQuotaCheck = null;
    this.quotaInfo = null;
    
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      retriedRequests: 0,
      rateLimitHits: 0,
      quotaWarnings: 0,
      averageResponseTime: 0,
      lastRequestTime: null
    };
    
    // Initialize
    this.initialize();
  }
  
  async initialize() {
    try {
      // Validate API key on startup
      validateApiKey();
      
      // Check quota on startup
      await this.checkAndUpdateQuota();
      
      // Start monitoring
      this.startMonitoring();
      
      logger.info('✅ OpenAI Request Manager initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize OpenAI Request Manager:', error.message);
      throw error;
    }
  }

  /**
   * Enhanced quota checking with caching
   */
  async checkAndUpdateQuota() {
    const now = Date.now();
    const quotaCheckInterval = 5 * 60 * 1000; // 5 minutes
    
    if (!this.lastQuotaCheck || (now - this.lastQuotaCheck) > quotaCheckInterval) {
      this.quotaInfo = await checkQuotaAndSubscription();
      this.lastQuotaCheck = now;
      
      if (this.quotaInfo.warnings && this.quotaInfo.warnings.length > 0) {
        this.stats.quotaWarnings++;
      }
    }
    
    return this.quotaInfo;
  }

  /**
   * Enhanced send request with exponential backoff retry logic
   * @param {Object} requestData - The request data to send to OpenAI
   * @param {string} requestId - Unique identifier for the request
   * @returns {Promise<Object>} - OpenAI response
   */
  async sendRequest(requestData, requestId = null) {
    const requestId_ = requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    this.concurrentRequests++;
    
    logger.info('🚀 Sending OpenAI request', {
      requestId: requestId_,
      model: requestData.model,
      messageCount: requestData.messages?.length || 0,
      concurrentRequests: this.concurrentRequests,
      queueSize: limiter.queued()
    });

    this.stats.totalRequests++;
    this.stats.lastRequestTime = new Date().toISOString();

    try {
      // Check quota before making request
      if (this.stats.totalRequests % 10 === 0) { // Check every 10 requests
        await this.checkAndUpdateQuota();
      }
      
      const response = await limiter.schedule(async () => {
        return await this.makeOpenAIRequestWithRetry(requestData, requestId_);
      });

      const responseTime = Date.now() - startTime;
      this.updateResponseTimeStats(responseTime);
      
      this.stats.successfulRequests++;
      this.concurrentRequests--;
      
      logger.info('✅ OpenAI request successful', { 
        requestId: requestId_,
        responseTime: `${responseTime}ms`,
        concurrentRequests: this.concurrentRequests
      });
      
      return response;
      
    } catch (error) {
      this.stats.failedRequests++;
      this.concurrentRequests--;
      
      // Check quota on failure if it's a rate limit error
      if (error.message.includes('Rate limit') || error.message.includes('quota')) {
        await this.checkAndUpdateQuota();
      }
      
      logger.error('❌ OpenAI request failed', {
        requestId: requestId_,
        error: error.message,
        status: error.response?.status,
        concurrentRequests: this.concurrentRequests,
        responseTime: `${Date.now() - startTime}ms`
      });
      
      throw error;
    }
  }
  
  /**
   * Update response time statistics
   */
  updateResponseTimeStats(responseTime) {
    if (this.stats.averageResponseTime === 0) {
      this.stats.averageResponseTime = responseTime;
    } else {
      this.stats.averageResponseTime = Math.round(
        (this.stats.averageResponseTime + responseTime) / 2
      );
    }
  }

  /**
   * Enhanced request method with specific exponential backoff retry logic
   * @param {Object} requestData - Request data
   * @param {string} requestId - Request identifier
   * @returns {Promise<Object>} - OpenAI response
   */
  async makeOpenAIRequestWithRetry(requestData, requestId) {
    let lastError = null;
    
    for (let attempt = 0; attempt <= RATE_LIMIT_CONFIG.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          this.stats.retriedRequests++;
          const delay = RATE_LIMIT_CONFIG.retryDelays[attempt - 1] || 8000;
          logger.info(`🔄 Retry attempt ${attempt}/${RATE_LIMIT_CONFIG.maxRetries} after ${delay}ms`, { requestId });
          await this.delay(delay);
        }
        
        const response = await this.makeOpenAIRequest(requestData, requestId, attempt);
        
        if (attempt > 0) {
          logger.info(`✅ Request succeeded on retry attempt ${attempt}`, { requestId });
        }
        
        return response;
        
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (error.message.includes('Invalid API key') || 
            error.message.includes('Bad request') || 
            error.message.includes('400')) {
          logger.error(`❌ Non-retryable error on attempt ${attempt + 1}: ${error.message}`, { requestId });
          throw error;
        }
        
        // Check if this is the last attempt
        if (attempt === RATE_LIMIT_CONFIG.maxRetries) {
          logger.error(`❌ All retry attempts exhausted for request ${requestId}`, {
            attempts: attempt + 1,
            finalError: error.message
          });
          break;
        }
        
        logger.warn(`⚠️ Request failed on attempt ${attempt + 1}, will retry: ${error.message}`, { requestId });
      }
    }
    
    // If we get here, all retries failed
    const errorMessage = this.getGracefulErrorMessage(lastError);
    throw new Error(errorMessage);
  }

  /**
   * Make the actual HTTP request to OpenAI (single attempt)
   * @param {Object} requestData - Request data  
   * @param {string} requestId - Request identifier
   * @param {number} attempt - Current attempt number
   * @returns {Promise<Object>} - OpenAI response
   */
  async makeOpenAIRequest(requestData, requestId, attempt = 0) {
    const config = {
      method: 'POST',
      url: OPENAI_API_URL,
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: requestData,
      timeout: 30000 // 30 second timeout
    };

    try {
      const response = await axios(config);
      return response.data;
      
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        // Handle rate limiting
        if (status === 429) {
          this.stats.rateLimitHits++;
          
          const retryAfter = parseInt(error.response.headers['retry-after']) || 60;
          
          logger.warn(`🚦 Rate limit hit on attempt ${attempt + 1}`, {
            requestId,
            retryAfter: `${retryAfter}s`,
            error: errorData?.error?.message,
            remainingAttempts: RATE_LIMIT_CONFIG.maxRetries - attempt
          });
          
          // If rate limit has a retry-after header longer than our standard delay, respect it
          if (retryAfter > 8) {
            logger.info(`⏰ Respecting Retry-After header: ${retryAfter}s`, { requestId });
            await this.delay(retryAfter * 1000);
          }
          
          throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
        }
        
        // Handle quota exceeded errors
        if (status === 429 && errorData?.error?.code === 'insufficient_quota') {
          this.stats.quotaWarnings++;
          logger.error('🚨 QUOTA EXCEEDED - insufficient funds', {
            requestId,
            error: errorData?.error?.message
          });
          throw new Error('You exceeded your current quota, please check your plan and billing details.');
        }
        
        // Handle other HTTP errors
        if (status >= 500) {
          throw new Error(`OpenAI server error: ${status}`);
        }
        
        if (status === 401) {
          throw new Error('Invalid API key');
        }
        
        if (status === 400) {
          throw new Error(`Bad request: ${errorData?.error?.message || 'Invalid request'}`);
        }
        
        throw new Error(`HTTP ${status}: ${errorData?.error?.message || 'Unknown error'}`);
      }
      
      // Handle network errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout');
      }
      
      if (error.code === 'ENOTFOUND') {
        throw new Error('Network error: Unable to reach OpenAI');
      }
      
      throw new Error(`Network error: ${error.message}`);
    }
  }
  
  /**
   * Get a graceful error message for the frontend
   * @param {Error} error - The error that occurred
   * @returns {string} - User-friendly error message
   */
  getGracefulErrorMessage(error) {
    if (!error) return 'Many users are asking right now. Please try again in a few moments.';
    
    if (error.message.includes('Rate limit') || error.message.includes('429')) {
      return 'Many users are asking right now. Please try again in a few moments.';
    }
    
    if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
      return 'The AI service is temporarily unavailable. Please try again later.';
    }
    
    if (error.message.includes('Invalid API key')) {
      return 'The AI service is currently being configured. Please try again later.';
    }
    
    if (error.message.includes('timeout') || error.message.includes('Network error')) {
      return 'The AI service is temporarily slow. Please try again.';
    }
    
    return 'Many users are asking right now. Please try again in a few moments.';
  }

  /**
   * Utility function to add delay
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get comprehensive status including quota information
   * @returns {Object} - Queue status, stats, and quota info
   */
  getStatus() {
    return {
      queue: {
        size: limiter.queued(),
        running: limiter.running(),
        done: limiter.done(),
        failed: limiter.failed(),
        concurrent: this.concurrentRequests
      },
      rateLimit: {
        reservoir: limiter.reservoir,
        limit: RATE_LIMIT_CONFIG.requestsPerMinute,
        retryDelays: RATE_LIMIT_CONFIG.retryDelays
      },
      stats: {
        ...this.stats,
        successRate: this.stats.totalRequests > 0 
          ? Math.round((this.stats.successfulRequests / this.stats.totalRequests) * 100) 
          : 0,
        retryRate: this.stats.totalRequests > 0 
          ? Math.round((this.stats.retriedRequests / this.stats.totalRequests) * 100) 
          : 0
      },
      quota: this.quotaInfo,
      lastQuotaCheck: this.lastQuotaCheck ? new Date(this.lastQuotaCheck).toISOString() : null,
      apiKey: {
        configured: !!OPENAI_API_KEY,
        type: OPENAI_API_KEY?.includes('sk-proj-') ? 'project-based' : 'standard',
        prefix: OPENAI_API_KEY ? `${OPENAI_API_KEY.substring(0, 8)}...` : 'not-set'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Enhanced monitoring and logging
   */
  startMonitoring() {
    // Log comprehensive status every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      const status = this.getStatus();
      
      logger.info('📊 System Status Report', {
        totalRequests: status.stats.totalRequests,
        successRate: `${status.stats.successRate}%`,
        retryRate: `${status.stats.retryRate}%`,
        rateLimitHits: status.stats.rateLimitHits,
        avgResponseTime: `${status.stats.averageResponseTime}ms`,
        queueSize: status.queue.size,
        concurrent: status.queue.concurrent
      });
      
      if (status.quota && status.quota.warnings && status.quota.warnings.length > 0) {
        logger.warn('⚠️ Quota warnings detected:', status.quota.warnings);
      }
    });

    // Check quota every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      try {
        await this.checkAndUpdateQuota();
        logger.info('🔍 Scheduled quota check completed');
      } catch (error) {
        logger.error('❌ Scheduled quota check failed:', error.message);
      }
    });

    // Reset stats daily and log summary
    cron.schedule('0 0 * * *', () => {
      const finalStats = { ...this.stats };
      
      logger.info('📈 Daily Summary', {
        date: new Date().toISOString().split('T')[0],
        totalRequests: finalStats.totalRequests,
        successfulRequests: finalStats.successfulRequests,
        failedRequests: finalStats.failedRequests,
        retriedRequests: finalStats.retriedRequests,
        rateLimitHits: finalStats.rateLimitHits,
        quotaWarnings: finalStats.quotaWarnings,
        averageResponseTime: `${finalStats.averageResponseTime}ms`
      });
      
      // Reset stats
      this.stats = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        retriedRequests: 0,
        rateLimitHits: 0,
        quotaWarnings: 0,
        averageResponseTime: 0,
        lastRequestTime: null
      };
      
      logger.info('🔄 Daily stats reset completed');
    });
    
    // Log high concurrent usage
    setInterval(() => {
      if (this.concurrentRequests >= 4) {
        logger.warn(`⚠️ High concurrent requests: ${this.concurrentRequests}/${RATE_LIMIT_CONFIG.maxConcurrent}`);
      }
    }, 10000); // Check every 10 seconds
  }

  /**
   * Gracefully shutdown the manager
   */
  async shutdown() {
    logger.info('Shutting down OpenAI request manager');
    await limiter.disconnect();
  }
}

// Initialize and validate before creating singleton
(async () => {
  try {
    validateApiKey();
    logger.info('🚀 OpenAI Manager starting up...');
  } catch (error) {
    logger.error('❌ OpenAI Manager startup failed:', error.message);
    process.exit(1);
  }
})();

// Create singleton instance
const openAIRequestManager = new OpenAIRequestManager();

// Handle process termination
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully');
  await openAIRequestManager.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  await openAIRequestManager.shutdown();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = {
  openAIRequestManager,
  logger,
  checkQuotaAndSubscription,
  validateApiKey
}; 