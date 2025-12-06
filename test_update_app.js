const axios = require('axios');

// Configuration
const BASE_URL = 'https://721bms2s-8000.inc1.devtunnels.ms/api/AaaS/v1';
const LOGIN_URL = `${BASE_URL}/login`;
const ADD_APP_URL = `${BASE_URL}/add`;
const UPDATE_APP_URL_TEMPLATE = `${BASE_URL}/update/:appId`;

// User credentials
const USER = {
    email: "flowtest1764924030057@example.com", // Use existing user
    password: "Password@123"
};

async function testUpdateApp() {
    try {
        // 1. Login
        console.log(`Logging in...`);
        const loginRes = await axios.post(LOGIN_URL, USER);
        let token = loginRes.data.data?.access_token || loginRes.data.data?.token || loginRes.data.token;
        if (typeof token === 'object' && token.access_token) token = token.access_token;

        if (!token) {
            console.error("Login failed: No token");
            return;
        }
        console.log("Login successful.");

        // 2. Create App to update
        const newApp = {
            app_name: `UpdateTest-${Date.now()}`,
            description: "To be updated",
            secret: "secret123"
        };

        console.log("Creating app...");
        const createRes = await axios.post(ADD_APP_URL, newApp, {
            headers: { 'Authorization': `Bearer ${token}`, 'token': token }
        });

        const appId = createRes.data.data.id || createRes.data.data.app_id; // Adjust based on actual response
        console.log(`App created with ID: ${appId}`);

        if (!appId) {
            console.error("Failed to get app ID from creation response:", createRes.data);
            return;
        }

        // 3. Update App
        const updateUrl = UPDATE_APP_URL_TEMPLATE.replace(':appId', appId);
        console.log(`Updating app at: ${updateUrl}`);

        const updateData = {
            app_name: `Updated-${Date.now()}`,
            description: "Updated description",
            secret: "newsecret123"
        };

        try {
            const updateRes = await axios.put(updateUrl, updateData, {
                headers: { 'Authorization': `Bearer ${token}`, 'token': token }
            });
            console.log("Update Success:", updateRes.status);
            console.log(updateRes.data);
        } catch (e) {
            console.error("Update Failed:", e.message);
            if (e.response) {
                console.error("Status:", e.response.status);
                console.error("Data:", e.response.data); // This might be HTML
            }
        }

    } catch (error) {
        console.error("Test Error:", error.message);
    }
}

testUpdateApp();
