const axios = require('axios');
const Bottleneck = require('bottleneck');
const winston = require('winston');
const cron = require('node-cron');

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

// Rate Limiting Configuration
const RATE_LIMIT_CONFIG = {
  // OpenAI's rate limits (adjust based on your plan)
  requestsPerMinute: 60, // Free tier: 3, Paid: 60-3500
  requestsPerHour: 3500,
  
  // Retry configuration
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  
  // Queue configuration
  maxConcurrent: 5,
  minTime: 100, // Minimum time between requests (ms)
  
  // Backoff strategy
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
  
  // Retry configuration
  retryCount: RATE_LIMIT_CONFIG.maxRetries,
  retryDelay: (retryCount) => {
    const delay = RATE_LIMIT_CONFIG.baseDelay * Math.pow(RATE_LIMIT_CONFIG.backoffMultiplier, retryCount);
    const jitter = delay * RATE_LIMIT_CONFIG.jitter * Math.random();
    return Math.min(delay + jitter, RATE_LIMIT_CONFIG.maxDelay);
  }
});

// Request queue for managing concurrent requests
class OpenAIRequestManager {
  constructor() {
    this.requestQueue = [];
    this.isProcessing = false;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      retriedRequests: 0,
      rateLimitHits: 0
    };
    
    // Start monitoring
    this.startMonitoring();
  }

  /**
   * Send a request to OpenAI with rate limiting and retry logic
   * @param {Object} requestData - The request data to send to OpenAI
   * @param {string} requestId - Unique identifier for the request
   * @returns {Promise<Object>} - OpenAI response
   */
  async sendRequest(requestData, requestId = null) {
    const requestId_ = requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logger.info('Sending OpenAI request', {
      requestId: requestId_,
      model: requestData.model,
      messageCount: requestData.messages?.length || 0
    });

    this.stats.totalRequests++;

    try {
      const response = await limiter.schedule(async () => {
        return await this.makeOpenAIRequest(requestData, requestId_);
      });

      this.stats.successfulRequests++;
      logger.info('OpenAI request successful', { requestId: requestId_ });
      
      return response;
      
    } catch (error) {
      this.stats.failedRequests++;
      logger.error('OpenAI request failed', {
        requestId: requestId_,
        error: error.message,
        status: error.response?.status,
        retryCount: error.retryCount || 0
      });
      
      throw error;
    }
  }

  /**
   * Make the actual HTTP request to OpenAI
   * @param {Object} requestData - Request data
   * @param {string} requestId - Request identifier
   * @returns {Promise<Object>} - OpenAI response
   */
  async makeOpenAIRequest(requestData, requestId) {
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
          logger.warn('Rate limit hit', {
            requestId,
            retryAfter: error.response.headers['retry-after'],
            error: errorData?.error?.message
          });
          
          // Add retry-after delay if provided
          const retryAfter = parseInt(error.response.headers['retry-after']) || 60;
          await this.delay(retryAfter * 1000);
          
          throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
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
   * Utility function to add delay
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current queue status and statistics
   * @returns {Object} - Queue status and stats
   */
  getStatus() {
    return {
      queue: {
        size: limiter.queued(),
        running: limiter.running(),
        done: limiter.done(),
        failed: limiter.failed()
      },
      rateLimit: {
        reservoir: limiter.reservoir,
        limit: RATE_LIMIT_CONFIG.requestsPerMinute
      },
      stats: this.stats,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Start monitoring and logging
   */
  startMonitoring() {
    // Log queue status every 5 minutes
    cron.schedule('*/5 * * * *', () => {
      const status = this.getStatus();
      logger.info('Queue status', status);
    });

    // Reset stats daily
    cron.schedule('0 0 * * *', () => {
      this.stats = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        retriedRequests: 0,
        rateLimitHits: 0
      };
      logger.info('Stats reset');
    });
  }

  /**
   * Gracefully shutdown the manager
   */
  async shutdown() {
    logger.info('Shutting down OpenAI request manager');
    await limiter.disconnect();
  }
}

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

module.exports = {
  openAIRequestManager,
  logger
}; 