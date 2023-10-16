// backend/controllers/roles.js

const Role = require('../models/Role');

// Create a new role
exports.createRole = async (req, res) => {
    const { name, permissions, tenantId } = req.body;

    try {
        const role = new Role({ name, permissions, tenantId });
        const savedRole = await role.save();
        res.status(201).json(savedRole);
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Get all roles for a specific tenant
exports.getAllRoles = async (req, res) => {
    const { tenantId } = req.params;

    try {
        const roles = await Role.find({ tenantId });
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Add more role-related controllers as needed.
