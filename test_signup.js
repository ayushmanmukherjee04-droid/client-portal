const axios = require('axios');

const data = {
    firstName: "Test",
    lastName: "User",
    email: "testnode" + Date.now() + "@example.com",
    mobileNumber: "1234567890",
    app: "TestApp",
    description: "Testing",
    password: "password123",
    confirmPassword: "password123"
};

axios.post('https://721bms2s-8000.inc1.devtunnels.ms/api/AaaS/v1/signUp', data)
    .then(res => {
        console.log("SUCCESS:", res.data);
    })
    .catch(err => {
        if (err.response) {
            console.log("FAILED STATUS:", err.response.status);
            console.log("FAILED DATA:", JSON.stringify(err.response.data, null, 2));
        } else {
            console.log("ERROR:", err.message);
        }
    });
