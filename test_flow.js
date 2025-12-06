const axios = require('axios');

// Configuration
const BASE_URL = 'https://721bms2s-8000.inc1.devtunnels.ms/api/AaaS/v1';
const SIGNUP_URL = `${BASE_URL}/signup`; // Using lowercase as fixed
const LOGIN_URL = `${BASE_URL}/login`;
const GET_APPS_URL = `${BASE_URL}/all`;

// Dynamic User
const timestamp = Date.now();
const USER = {
    firstName: "Flow",
    lastName: "Test",
    email: `flowtest${timestamp}@example.com`,
    mobileNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    app: `App-${timestamp}`,
    description: "Test App Description",
    password: "Password@123",
    confirmPassword: "Password@123"
};

async function testFlow() {
    try {
        // 1. Signup
        console.log(`1. Signing up as ${USER.email} with app ${USER.app}...`);
        try {
            const signupRes = await axios.post(SIGNUP_URL, USER);
            console.log("Signup Status:", signupRes.status);
            console.log("Signup Data:", JSON.stringify(signupRes.data, null, 2));
        } catch (e) {
            console.error("Signup Failed:", e.response?.data || e.message);
            return;
        }

        // 2. Login
        console.log(`\n2. Logging in...`);
        let token;
        try {
            const loginRes = await axios.post(LOGIN_URL, {
                email: USER.email,
                password: USER.password
            });
            console.log("Login Status:", loginRes.status);
            // Check where the token is
            const data = loginRes.data;
            if (data.data && data.data.access_token) token = data.data.access_token;
            else if (data.data && data.data.token) token = data.data.token;
            else if (data.token) token = data.token;

            console.log("Token received:", token ? "YES" : "NO");
        } catch (e) {
            console.error("Login Failed:", e.response?.data || e.message);
            return;
        }

        if (!token) {
            console.error("Cannot proceed without token.");
            return;
        }

        // 3. Get Apps
        console.log(`\n3. Fetching apps...`);
        try {
            const appsRes = await axios.get(GET_APPS_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    token: token
                }
            });
            console.log("Get Apps Status:", appsRes.status);
            console.log("Get Apps Data:", JSON.stringify(appsRes.data, null, 2));

            const apps = appsRes.data.data;
            if (Array.isArray(apps) && apps.length > 0) {
                console.log("\nSUCCESS: Apps found!");
                console.log("App Name:", apps[0].app_name);
            } else {
                console.log("\nFAILURE: No apps found in response.");
            }

        } catch (e) {
            console.error("Get Apps Failed:", e.response?.data || e.message);
            // Try without Bearer prefix just in case
            console.log("Retrying without Bearer prefix...");
            try {
                const appsRes = await axios.get(GET_APPS_URL, {
                    headers: { Authorization: token }
                });
                console.log("Get Apps (No Bearer) Status:", appsRes.status);
                console.log("Get Apps (No Bearer) Data:", JSON.stringify(appsRes.data, null, 2));
            } catch (e2) {
                console.error("Get Apps (No Bearer) Failed:", e2.response?.data || e2.message);
            }
        }

    } catch (error) {
        console.error("Unexpected Error:", error.message);
    }
}

testFlow();
