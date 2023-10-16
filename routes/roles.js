// backend/routes/roles.js

const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles');

// Route for creating a new role
router.post('/create', rolesController.createRole);

// Route for getting all roles for a specific tenant
router.get('/all/:tenantId', rolesController.getAllRoles);

// Add more role-related routes as needed.

module.exports = router;
