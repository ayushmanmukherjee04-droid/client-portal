import fs from 'fs';
import path from 'path';
import cookie from 'cookie';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ statusCode: 405, data: null, message: 'Method not allowed', status: 'error' });
    }

    const { email, password } = req.body;

    const filePath = path.join(process.cwd(), 'data', 'users.json');

    if (!fs.existsSync(filePath)) {
        return res.status(401).json({ statusCode: 401, data: null, message: 'Invalid credentials', status: 'error' });
    }

    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const users = JSON.parse(fileData);

        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return res.status(401).json({ statusCode: 401, data: null, message: 'Invalid credentials', status: 'error' });
        }

        const token = `mock_token_${user.id}`;

        // Set cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("access_token", token, {
                httpOnly: false, // Allow client to read for Navbar logic (simplified)
                secure: process.env.NODE_ENV === "production",
                maxAge: 3600,
                sameSite: "lax",
                path: "/",
            })
        );

        const { password: _, ...safeUser } = user;

        return res.status(200).json({
            statusCode: 200,
            data: {
                tokens: { access_token: token },
                client_data: safeUser
            },
            message: 'Login successful',
            status: 'success'
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ statusCode: 500, data: null, message: 'Internal server error', status: 'error' });
    }
}
