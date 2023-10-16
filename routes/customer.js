const express = require("express");
const router = express.Router();
const customerController = require('../controllers/customer')
const checkRole = require('../middleware/checkRole');
router.post(
    "/create",
    checkRole(["tenant"]),
    customerController.createCustomer,
);

router.get(
    "/:dbName",
    checkRole(["tenant"]),
    customerController.getAllCustomers,
);

router.get('/data/:username', checkRole(["customer"]), customerController.getCustomerByName);

module.exports = router;


