// backend/routes/tenants.js

const express = require('express');
const router = express.Router();
const tenantsController = require('../controllers/tenants');
const checkRole = require('../middleware/checkRole');



// Create a new tenant
router.post('/create', checkRole(['superadmin']), tenantsController.createTenant);

// Get all tenants for superadmin
router.get('/', checkRole(['superadmin']), tenantsController.getAllTenants);

// Add more routes for updating, deleting, and other tenant-related operations as needed.

//get particular tenants by their username
router.get('/mydata', checkRole(['tenant']), tenantsController.getTenantData);

module.exports = router;
