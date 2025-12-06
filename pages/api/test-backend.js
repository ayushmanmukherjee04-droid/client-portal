// TEST FILE - Check if backend connection is working
// Open this in browser: http://localhost:3003/api/test-backend

export default async function handler(req, res) {
    try {
        // Test 1: Check if we can reach the backend
        const backendUrl = 'https://721bms2s-8000.inc1.devtunnels.ms/api/AaaS/v1/signUp';

        console.log('Testing backend connection to:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: 'Test',
                lastName: 'User',
                email: 'test.backend@example.com',
                mobileNumber: '1234567890',
                app_name: 'TestApp', // Using app_name
                description: 'Test',
                password: 'Password123',
                confirmPassword: 'Password123'
            })
        });

        const data = await response.json();

        return res.status(200).json({
            success: true,
            statusCode: response.status,
            backendUrl,
            response: data,
            message: 'Backend connection test complete'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Failed to connect to backend'
        });
    }
}
