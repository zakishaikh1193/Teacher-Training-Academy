const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

console.log('🔍 OpenAI API Debugger');
console.log('=====================');
console.log(`API Key: ${OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 20) + '...' : 'NOT FOUND'}`);
console.log(`API URL: ${OPENAI_API_URL}`);
console.log('');

async function testOpenAIConnection() {
  try {
    console.log('🧪 Testing OpenAI API connection...');
    
    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: 'Hello!'
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    console.log('✅ OpenAI API is working!');
    console.log('Response:', response.data.choices[0]?.message?.content);
    return true;
    
  } catch (error) {
    console.error('❌ OpenAI API Error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.error?.message);
    console.error('Full error:', error.message);
    
    if (error.response?.status === 401) {
      console.error('🔑 Authentication failed - Check your API key');
    } else if (error.response?.status === 429) {
      console.error('⏰ Rate limit exceeded - Try again later');
    } else if (error.response?.status === 404) {
      console.error('🚫 Model not found - Check model name');
    }
    
    return false;
  }
}

async function testBackendHealth() {
  try {
    console.log('\n🏥 Testing backend health...');
    
    const response = await axios.get('http://localhost:3002/api/health');
    console.log('✅ Backend is healthy:', response.data);
    return true;
    
  } catch (error) {
    console.error('❌ Backend health check failed:');
    console.error('Error:', error.message);
    return false;
  }
}

async function testChatbotEndpoint() {
  try {
    console.log('\n🤖 Testing chatbot endpoint...');
    
    const response = await axios.post('http://localhost:3002/api/chatbot/chat', {
      message: 'Hello',
      user: { id: 1, firstname: 'Test', lastname: 'User' },
      conversationHistory: [],
      selectedLanguage: 'en'
    });
    
    console.log('✅ Chatbot endpoint is working!');
    console.log('Response:', response.data);
    return true;
    
  } catch (error) {
    console.error('❌ Chatbot endpoint failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive debug...\n');
  
  const openaiTest = await testOpenAIConnection();
  const backendTest = await testBackendHealth();
  const chatbotTest = await testChatbotEndpoint();
  
  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`OpenAI API: ${openaiTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Backend Health: ${backendTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Chatbot Endpoint: ${chatbotTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (!openaiTest) {
    console.log('\n🔧 Solutions:');
    console.log('1. Check your OpenAI API key in .env file');
    console.log('2. Verify your OpenAI account has credits');
    console.log('3. Try using a different API key');
  }
  
  if (!backendTest) {
    console.log('\n🔧 Solutions:');
    console.log('1. Make sure the server is running on port 3002');
    console.log('2. Check if the server started without errors');
  }
  
  if (!chatbotTest) {
    console.log('\n🔧 Solutions:');
    console.log('1. Check if the chatbot middleware is properly configured');
    console.log('2. Verify the API routes are correctly set up');
  }
}

// Run the debugger
runAllTests().catch(console.error); 