import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { firstName, lastName, email, password } = req.body;

        const filePath = path.join(process.cwd(), 'data', 'users.json');
        const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Check if user exists
        if (users.find(u => u.email === email)) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            password, // In a real app, hash this!
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        // Save back to file
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
