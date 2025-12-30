const axios = require('axios');

async function testEndpoint() {
    try {
        console.log('Testing news endpoint...');
        const response = await axios.get('http://localhost:3001/api/v1/news/crypto');
        console.log('Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error Response Status:', error.response.status);
            console.log('Error Response Data:\n', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

testEndpoint();
