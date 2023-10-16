// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Route for user login
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Add more authentication-related routes as needed.

module.exports = router;
