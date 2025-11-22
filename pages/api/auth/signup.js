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
