const axios = require('axios');

// Test script for verifying rate limit handling and retry logic
const BASE_URL = 'http://localhost:3002/api/chatbot';

// Test configuration
const TEST_CONFIG = {
  concurrent: 10, // Number of concurrent requests
  total: 50, // Total requests to send
  delay: 100 // Delay between batches (ms)
};

// Sample test messages
const testMessages = [
  'Hello, how can you help me?',
  'What courses are available?',
  'Tell me about the schools',
  'Show me user information',
  'مرحباً، كيف يمكنك مساعدتي؟',
  'ما هي الدورات المتاحة؟',
  'أخبرني عن المدارس',
  'أظهر لي معلومات المستخدمين'
];

const categories = [
  { id: 'general', name: 'General Support', nameAr: 'الدعم العام' },
  { id: 'courses', name: 'Course Management', nameAr: 'إدارة الدورات' },
  { id: 'users', name: 'User Management', nameAr: 'إدارة المستخدمين' }
];

// Create a test request
function createTestRequest(index) {
  const messageIndex = index % testMessages.length;
  const categoryIndex = index % categories.length;
  const isArabic = messageIndex >= 4;
  
  return {
    message: testMessages[messageIndex],
    user: { id: `test_user_${index}`, name: 'Test User' },
    category: categories[categoryIndex],
    selectedLanguage: isArabic ? 'ar' : 'en',
    conversationHistory: []
  };
}

// Send a single request and track results
async function sendTestRequest(index) {
  const startTime = Date.now();
  const requestData = createTestRequest(index);
  
  try {
    console.log(`🚀 Sending request ${index + 1}: "${requestData.message}"`);
    
    const response = await axios.post(`${BASE_URL}/chat`, requestData, {
      timeout: 60000 // 60 second timeout
    });
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Request ${index + 1} completed in ${duration}ms`, {
      graceful: response.data.graceful || false,
      fallback: response.data.fallback || false,
      hasData: !!response.data.data,
      requestId: response.data.requestId
    });
    
    return {
      index,
      success: true,
      duration,
      status: response.status,
      graceful: response.data.graceful || false,
      fallback: response.data.fallback || false,
      requestId: response.data.requestId
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.log(`❌ Request ${index + 1} failed in ${duration}ms:`, {
      status: error.response?.status,
      error: error.response?.data?.error || error.message,
      graceful: error.response?.data?.graceful || false
    });
    
    return {
      index,
      success: false,
      duration,
      status: error.response?.status || 0,
      error: error.response?.data?.error || error.message,
      graceful: error.response?.data?.graceful || false
    };
  }
}

// Test concurrent requests
async function testConcurrentRequests(count) {
  console.log(`\n🧪 Testing ${count} concurrent requests...\n`);
  
  const promises = Array.from({ length: count }, (_, i) => sendTestRequest(i));
  const results = await Promise.allSettled(promises);
  
  return results.map(result => result.value || result.reason);
}

// Test sequential batches
async function testSequentialBatches() {
  console.log(`\n🔄 Testing sequential batches of ${TEST_CONFIG.concurrent} requests...\n`);
  
  const allResults = [];
  const totalBatches = Math.ceil(TEST_CONFIG.total / TEST_CONFIG.concurrent);
  
  for (let batch = 0; batch < totalBatches; batch++) {
    const batchStart = batch * TEST_CONFIG.concurrent;
    const batchEnd = Math.min(batchStart + TEST_CONFIG.concurrent, TEST_CONFIG.total);
    const batchSize = batchEnd - batchStart;
    
    console.log(`\n--- Batch ${batch + 1}/${totalBatches} (${batchSize} requests) ---`);
    
    const batchResults = await testConcurrentRequests(batchSize);
    allResults.push(...batchResults);
    
    if (batch < totalBatches - 1) {
      console.log(`⏳ Waiting ${TEST_CONFIG.delay}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.delay));
    }
  }
  
  return allResults;
}

// Analyze results
function analyzeResults(results) {
  const total = results.length;
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => r.success === false).length;
  const graceful = results.filter(r => r.graceful).length;
  const fallback = results.filter(r => r.fallback).length;
  
  const durations = results.map(r => r.duration);
  const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
  const maxDuration = Math.max(...durations);
  const minDuration = Math.min(...durations);
  
  const statusCodes = {};
  results.forEach(r => {
    const status = r.status || 'unknown';
    statusCodes[status] = (statusCodes[status] || 0) + 1;
  });
  
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`Total Requests: ${total}`);
  console.log(`Successful: ${successful} (${Math.round(successful/total*100)}%)`);
  console.log(`Failed: ${failed} (${Math.round(failed/total*100)}%)`);
  console.log(`Graceful Errors: ${graceful} (${Math.round(graceful/total*100)}%)`);
  console.log(`Fallback Responses: ${fallback} (${Math.round(fallback/total*100)}%)`);
  console.log(`\nResponse Times:`);
  console.log(`  Average: ${Math.round(avgDuration)}ms`);
  console.log(`  Min: ${minDuration}ms`);
  console.log(`  Max: ${maxDuration}ms`);
  console.log(`\nStatus Codes:`, statusCodes);
  
  return {
    total,
    successful,
    failed,
    graceful,
    fallback,
    avgDuration,
    maxDuration,
    minDuration,
    statusCodes
  };
}

// Check backend status
async function checkBackendStatus() {
  try {
    console.log('🔍 Checking backend status...');
    
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Backend health:', healthResponse.data);
    
    const statusResponse = await axios.get(`${BASE_URL}/status`);
    console.log('📊 Backend status:', {
      totalRequests: statusResponse.data.stats.totalRequests,
      successRate: statusResponse.data.stats.successRate,
      queueSize: statusResponse.data.queue.size,
      concurrent: statusResponse.data.queue.concurrent,
      apiKeyConfigured: statusResponse.data.apiKey.configured
    });
    
    return true;
  } catch (error) {
    console.error('❌ Backend not responding:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 OpenAI Rate Limit & Retry Test Script');
  console.log('==========================================\n');
  
  // Check if backend is running
  const backendReady = await checkBackendStatus();
  if (!backendReady) {
    console.log('❌ Backend is not ready. Please start the server first.');
    process.exit(1);
  }
  
  console.log(`\nTest Configuration:`);
  console.log(`- Concurrent requests per batch: ${TEST_CONFIG.concurrent}`);
  console.log(`- Total requests: ${TEST_CONFIG.total}`);
  console.log(`- Delay between batches: ${TEST_CONFIG.delay}ms`);
  
  // Run the tests
  const startTime = Date.now();
  const results = await testSequentialBatches();
  const totalTime = Date.now() - startTime;
  
  // Analyze and display results
  const analysis = analyzeResults(results);
  
  console.log(`\nTotal Test Duration: ${Math.round(totalTime/1000)}s`);
  console.log(`Average Requests/Second: ${Math.round(TEST_CONFIG.total / (totalTime/1000))}`);
  
  // Final status check
  console.log('\n--- Final Backend Status ---');
  await checkBackendStatus();
  
  console.log('\n✅ Test completed!');
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runTests,
  testConcurrentRequests,
  checkBackendStatus,
  analyzeResults
};