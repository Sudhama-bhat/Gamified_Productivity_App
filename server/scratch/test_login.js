const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gamified.com',
      password: 'admin123'
    });
    console.log('Login Success:', res.data);
  } catch (err) {
    console.log('Login Failed:', err.response?.status, err.response?.data);
  }
}

testLogin();
