const axios = require('axios');

// Quick test to verify timeout fixes are working
const BASE_URL = 'http://localhost:3002/api/chatbot';

async function testSingleRequest() {
  console.log('🧪 Testing single chatbot request...');
  
  try {
    const startTime = Date.now();
    
    const response = await axios.post(`${BASE_URL}/chat`, {
      message: 'Hello, can you help me?',
      user: { id: 'test_user', name: 'Test User' },
      category: { id: 'general', name: 'General Support' },
      selectedLanguage: 'en',
      conversationHistory: []
    }, {
      timeout: 120000 // 2 minute timeout for this test
    });
    
    const duration = Date.now() - startTime;
    
    console.log('✅ Request successful!', {
      duration: `${duration}ms`,
      messageLength: response.data.message?.length,
      graceful: response.data.graceful || false,
      fallback: response.data.fallback || false,
      requestId: response.data.requestId
    });
    
    return { success: true, duration };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.log('❌ Request failed:', {
      duration: `${duration}ms`,
      status: error.response?.status,
      error: error.response?.data?.error || error.message,
      graceful: error.response?.data?.graceful || false
    });
    
    return { success: false, duration, error: error.message };
  }
}

async function checkBackendHealth() {
  try {
    console.log('🔍 Checking backend health...');
    
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    
    console.log('✅ Backend health:', {
      status: response.data.status,
      uptime: `${Math.round(response.data.uptime)}s`,
      queueRunning: response.data.queue?.running || 0,
      queueSize: response.data.queue?.size || 0
    });
    
    return true;
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    return false;
  }
}

async function checkBackendStatus() {
  try {
    console.log('📊 Checking backend status...');
    
    const response = await axios.get(`${BASE_URL}/status`, { timeout: 5000 });
    
    console.log('📈 Backend status:', {
      totalRequests: response.data.stats.totalRequests,
      successRate: response.data.stats.successRate,
      avgResponseTime: response.data.stats.averageResponseTime,
      rateLimitHits: response.data.stats.rateLimitHits,
      apiKeyType: response.data.apiKey?.type,
      apiKeyConfigured: response.data.apiKey?.configured
    });
    
    if (response.data.quota?.warnings?.length > 0) {
      console.log('⚠️ Quota warnings:', response.data.quota.warnings);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Backend status check failed:', error.message);
    return false;
  }
}

async function runQuickTest() {
  console.log('🚀 Quick Timeout Fix Test');
  console.log('==========================\n');
  
  // Check if backend is responsive
  const healthOk = await checkBackendHealth();
  if (!healthOk) {
    console.log('\n❌ Backend is not responding. Please start the server first:');
    console.log('cd server && npm start');
    process.exit(1);
  }
  
  // Check backend status
  await checkBackendStatus();
  
  // Test a single request
  console.log('\n--- Testing Single Request ---');
  const result = await testSingleRequest();
  
  console.log('\n📋 Test Summary:');
  console.log(`Request: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  console.log(`Duration: ${result.duration}ms`);
  
  if (result.duration > 30000) {
    console.log('⚠️ Request took longer than 30 seconds - this would have timed out before the fix!');
  } else {
    console.log('✅ Request completed within reasonable time');
  }
  
  // Final backend status check
  console.log('\n--- Final Backend Status ---');
  await checkBackendStatus();
  
  console.log('\n✅ Quick test completed!');
  
  if (result.success) {
    console.log('\n🎉 Timeout fixes appear to be working correctly!');
    console.log('The frontend should now handle longer backend response times gracefully.');
  } else {
    console.log('\n❌ There may still be issues. Check the server logs for more details.');
  }
}

// Run the test
runQuickTest().catch(error => {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
});