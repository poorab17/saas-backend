// backend/controllers/users.js

const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
    const { username, password, role, tenantId } = req.body;

    try {
        const user = new User({ username, password, role, tenantId });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Get all users for a specific tenant
exports.getAllUsers = async (req, res) => {
    const { tenantId } = req.params;

    try {
        const users = await User.find({ tenantId });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Add more user-related controllers as needed.
