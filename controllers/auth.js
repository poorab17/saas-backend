// Import required modules and models
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { jwtSecret } = require('../config/auth');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const CustomerTenant = require('../models/Customer');
const mongoose = require('mongoose');

// Variable to store the database name
let databasename;


// User login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    let customer;
    let id = null;
    try {
        let isSuperadmin = false;
        let isTenant = false;
        let isCustomer = false;

        // For superadmin
        const user = await User.findOne({ username });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                isSuperadmin = user.role === 'superadmin';
            }
        }

        // For tenant
        const tenant = await Tenant.findOne({ username });
        if (tenant) {
            const passwordMatch = await bcrypt.compare(password, tenant.password);
            if (passwordMatch) {
                isTenant = tenant.role === 'tenant';
            }
        }

        id = user ? user._id : (tenant ? tenant._id : (customer ? customer._id : null));
        // Create a connection to the CustomerTenant database
        const customerTenantConnection = mongoose.createConnection(`mongodb://127.0.0.1:27017/customerTenantDB`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        customerTenantConnection.on('connected', async () => {
            console.log('Connected to CustomerTenant database');

            const customerTenantCollection = customerTenantConnection.collection('customerTenant');

            // Use a query object to match documents based on the 'username' field
            const query = { username };

            const databasenameEntry = await customerTenantCollection.findOne(query);

            if (databasenameEntry) {
                databasename = databasenameEntry.databaseName;
                console.log('Found databasename:', databasename);

                // Create a connection to the user-specific database
                const conn = mongoose.createConnection(`mongodb://127.0.0.1:27017/${databasename}`, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });

                // Define the Customer schema
                const Customer = conn.model('Customer', new mongoose.Schema({
                    username: {
                        type: String,
                        required: true,
                        unique: true,
                    },
                    password: {
                        type: String,
                        required: true,
                    },
                    role: {
                        type: String,
                        enum: ["superadmin", "tenant", "customer"],
                        default: "customer",
                    },
                }));

                // Find the customer by username
                const customer = await Customer.findOne({ username });

                console.log(customer._id);
                if (customer) {
                    const passwordMatch = await bcrypt.compare(password, customer.password);
                    if (passwordMatch) {
                        isCustomer = customer.role === 'customer';
                    }
                    id = user ? user._id : (tenant ? tenant._id : (customer ? customer._id : null));
                }
            } else {
                console.log('Data not found for the provided username.');
            }
            console.log(id);

            if (!isSuperadmin && !isTenant && !isCustomer) {
                return res.status(401).json({ message: 'Authentication failed. SuperAdmin, Tenant, or Customer not found.' });
            }

            // Determine the appropriate user ID based on the role


            // Define the basic payload with common properties
            const payload = { userId: id, username, isSuperadmin, isTenant, isCustomer };

            // If the user is a tenant, add the 'name' property to the payload
            if (tenant) {
                payload.name = tenant.name;
            }

            // Generate a JWT token and set it as an HTTP-only cookie
            const token = jwt.sign(
                payload,
                jwtSecret,
                { expiresIn: '1h' } // Token expires in 1 hour
            );

            res.cookie('jwtToken', token, { httpOnly: true });


            res.status(200).json({ payload, token });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Logout function
exports.logout = (req, res) => {
    // Clear the JWT token by setting an empty token and expiring it immediately
    res.cookie('jwtToken', '', { expires: new Date(0) });
    res.status(200).json({ message: 'Logout successful.' });
};

// Add more authentication-related controllers as needed.
exports.refreshToken = (req, res) => {
    const token = req.cookies.jwtToken; // Assuming the JWT token is stored in a cookie
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const newToken = jwt.sign(
            {
                userId: decoded.userId,
                username: decoded.username,
                isSuperadmin: decoded.isSuperadmin,
                isTenant: decoded.isTenant,
                isCustomer: decoded.isCustomer,
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.cookie('jwtToken', newToken, { httpOnly: true });
        res.status(200).json({ token: newToken });
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

exports.verifyToken = (req, res) => {
    const token = req.cookies.jwtToken; // Assuming the JWT token is stored in a cookie
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};