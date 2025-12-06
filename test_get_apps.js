const axios = require('axios');

// Configuration
const BASE_URL = 'https://721bms2s-8000.inc1.devtunnels.ms/api/AaaS/v1';
const LOGIN_URL = `${BASE_URL}/login`;
const GET_APPS_URL = `${BASE_URL}/all`;

// User credentials (use the one created in signup test or a known user)
const USER = {
    email: "test@example.com", // Replace with a valid email if needed
    password: "password123"
};

async function testGetApps() {
    try {
        // 1. Login to get token
        console.log(`Logging in as ${USER.email}...`);
        const loginRes = await axios.post(LOGIN_URL, USER);
        const token = loginRes.data.data.access_token || loginRes.data.data.token; // Adjust based on actual response

        if (!token) {
            console.error("Login successful but no token found in response:", loginRes.data);
            return;
        }
        console.log("Login successful. Token received.");

        // 2. Get Apps
        console.log(`Fetching apps from ${GET_APPS_URL}...`);
        const appsRes = await axios.get(GET_APPS_URL, {
            headers: { Authorization: `Bearer ${token}` } // Or just 'token' based on backend
        });

        console.log("Get Apps Response Status:", appsRes.status);
        console.log("Get Apps Response Data:", JSON.stringify(appsRes.data, null, 2));

    } catch (error) {
        if (error.response) {
            console.error("Error Status:", error.response.status);
            console.error("Error Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error Message:", error.message);
        }
    }
}

testGetApps();
