// backend/routes/tenants.js

const express = require('express');
const router = express.Router();
const tenantsController = require('../controllers/tenants');
const checkRole = require('../middleware/checkRole');



// Create a new tenant
router.post('/create', checkRole(['superadmin']), tenantsController.createTenant);

//update
router.put('/:tenantId', checkRole(['superadmin']), tenantsController.createTenant);

//delete
router.delete('/delete/:tenantId', checkRole(['superadmin']), tenantsController.deleteTenant);

// Get all tenants for superadmin
router.get('/', checkRole(['superadmin']), tenantsController.getAllTenants);

// Add more routes for updating, deleting, and other tenant-related operations as needed.

//get particular tenants by their username
router.get('/mydata', checkRole(['tenant']), tenantsController.getTenantDataByName);

//get particular tenants by id
router.get('/:tenantId', checkRole(['superadmin']), tenantsController.getTenantData);
module.exports = router;
