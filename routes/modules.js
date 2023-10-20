// backend/routes/modules.js

const express = require('express');
const router = express.Router();
const modulesController = require('../controllers/modules');
const permissionController = require("../controllers/permission")

const checkRole = require('../middleware/checkRole'); // Assuming you have a role-based middleware

// Create a new module (only accessible to superadmins)
router.post('/create', checkRole(['superadmin']), modulesController.createModule);

//delete
router.delete('/delete/:moduleId', checkRole(['superadmin']), modulesController.delete);

// Get all modules
router.get('/', modulesController.getAllModules);

// Add more routes for updating, deleting, and other module-related operations as needed.
router.get('/:moduleName', checkRole(['superadmin']), modulesController.getModuleByName);


//permission
router.post('/permission', checkRole(['superadmin']), permissionController.grantPermission);
module.exports = router;


