// backend/routes/users.js

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// Route for creating a new user
router.post('/create', usersController.createUser);

// Route for getting all users for a specific tenant
router.get('/all/:tenantId', usersController.getAllUsers);

// Add more user-related routes as needed.

module.exports = router;
