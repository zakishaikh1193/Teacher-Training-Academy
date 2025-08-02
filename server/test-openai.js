const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API...');
    console.log('API Key:', OPENAI_API_KEY.substring(0, 20) + '...');
    
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
      }
    });

    console.log('✅ OpenAI API is working!');
    console.log('Response:', response.data.choices[0]?.message?.content);
  } catch (error) {
    console.error('❌ OpenAI API Error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.error?.message);
    console.error('Full error:', error.message);
  }
}

testOpenAI(); 