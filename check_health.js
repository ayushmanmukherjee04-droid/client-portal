const axios = require('axios');

async function checkHealth() {
    try {
        console.log("Checking backend connectivity...");
        // Try a simple GET request to a known endpoint, or just the root
        // Using login endpoint as a connectivity check (expecting 405 or 400, but not timeout)
        const res = await axios.get('https://721bms2s-8000.inc1.devtunnels.ms/api/AaaS/v1/login').catch(e => e.response);

        if (res) {
            console.log(`Server responded with status: ${res.status}`);
            console.log("Headers:", res.headers);
        } else {
            console.log("No response received (Network Error)");
        }
    } catch (e) {
        console.error("Connectivity Check Failed:", e.message);
    }
}

checkHealth();
