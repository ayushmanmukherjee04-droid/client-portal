const axios = require('axios');

// Configuration
const BASE_URL = 'https://721bms2s-8000.inc1.devtunnels.ms/api/AaaS/v1';
const LOGIN_URL = `${BASE_URL}/login`;
const ADD_APP_URL = `${BASE_URL}/add`;

// User credentials
const USER = {
    email: "flowtest1764924030057@example.com", // Use the user created in previous test
    password: "Password@123"
};

async function testCreateApp() {
    try {
        // 1. Login to get token
        console.log(`Logging in as ${USER.email}...`);
        const loginRes = await axios.post(LOGIN_URL, USER);
        const data = loginRes.data;
        let token = data.data?.access_token || data.data?.token || data.token;
        if (typeof token === 'object' && token.access_token) {
            token = token.access_token;
        }

        if (!token) {
            console.error("Login failed: No token received");
            return;
        }
        console.log("Login successful. Token received.");

        // 2. Create App
        const newApp = {
            app_name: `NewApp-${Date.now()}`,
            description: "Created via test script",
            secret: "secretKey123"
        };

        console.log(`Creating app: ${newApp.app_name}...`);

        // Test with BOTH headers as apiClient does
        try {
            const res = await axios.post(ADD_APP_URL, newApp, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'token': token
                }
            });
            console.log("Create App Status:", res.status);
            console.log("Create App Response:", JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.error("Create App Failed:", e.response?.data || e.message);
        }

    } catch (error) {
        console.error("Unexpected Error:", error.message);
    }
}

testCreateApp();
