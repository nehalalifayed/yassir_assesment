const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('Testing Air Quality API...\n');

  try {
    // Test 1: Get air quality for Paris coordinates
    console.log('1. Testing /api/air-quality with Paris coordinates...');
    const response1 = await axios.get(`${BASE_URL}/api/air-quality?latitude=48.8566&longitude=2.3522`);
    console.log('✅ Success:', JSON.stringify(response1.data, null, 2));
    console.log('');

    // Test 2: Get current Paris air quality
    console.log('2. Testing /api/paris/air-quality...');
    const response2 = await axios.get(`${BASE_URL}/api/paris/air-quality`);
    console.log('✅ Success:', JSON.stringify(response2.data, null, 2));
    console.log('');

    // Test 3: Get most polluted datetime (might return 404 if no data yet)
    console.log('3. Testing /api/paris/most-polluted...');
    try {
      const response3 = await axios.get(`${BASE_URL}/api/paris/most-polluted`);
      console.log('✅ Success:', JSON.stringify(response3.data, null, 2));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('ℹ️  No data found yet (expected if cron job hasn\'t run yet)');
      } else {
        console.log('❌ Error:', error.response?.data || error.message);
      }
    }
    console.log('');

    // Test 4: Test error handling - missing parameters
    console.log('4. Testing error handling - missing parameters...');
    try {
      await axios.get(`${BASE_URL}/api/air-quality`);
    } catch (error) {
      console.log('✅ Expected error:', error.response.data.error);
    }
    console.log('');

    // Test 5: Test error handling - invalid coordinates
    console.log('5. Testing error handling - invalid coordinates...');
    try {
      await axios.get(`${BASE_URL}/api/air-quality?latitude=invalid&longitude=2.3522`);
    } catch (error) {
      console.log('✅ Expected error:', error.response.data.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('Make sure the server is running with: npm start');
    }
  }
}

testAPI();
