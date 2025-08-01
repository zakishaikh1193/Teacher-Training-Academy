const express = require('express');
const cors = require('cors');
const chatbotMiddleware = require('./middleware/chatbotMiddleware');

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

// Main chatbot endpoint with rate limiting
router.post('/chat', chatbotMiddleware.processChatMessage);

// Queue status endpoint
router.get('/status', chatbotMiddleware.getQueueStatus);

// Health check endpoint
router.get('/health', chatbotMiddleware.healthCheck);

module.exports = router; 