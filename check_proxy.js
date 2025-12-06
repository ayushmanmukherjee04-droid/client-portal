const axios = require('axios');

async function checkProxy() {
    try {
        console.log("Checking connectivity via Next.js Proxy...");
        // Hit the Next.js proxy which forwards to the backend
        const res = await axios.get('http://localhost:3000/backend/api/AaaS/v1/login').catch(e => e.response);

        if (res) {
            console.log(`Proxy responded with status: ${res.status}`);
            console.log("Headers:", res.headers);
            console.log("Data:", JSON.stringify(res.data).substring(0, 200));
        } else {
            console.log("No response received from Proxy (Network Error)");
        }
    } catch (e) {
        console.error("Proxy Check Failed:", e.message);
    }
}

checkProxy();
