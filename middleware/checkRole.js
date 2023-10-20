// backend/middleware/checkRole.js

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const getUserSpecificCustomerModel = require("../helper/dbHelper");
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Customer = require("../helper/dbHelper");





// Middleware to check the user's role (superadmin, tenant, or customer)
const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            // const token = req.cookies.jwtToken;
            // console.log(token, "token")

            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Authentication failed. Token not found.' });
            }
            const token = authorizationHeader.replace('Bearer ', '');
            // const decoded = jwt.verify(token, jwtSecret);
            if (!token) {
                console.log("tke not available not")
                return res.status(401).json({ message: 'Authentication failed. Token not found.' });
            }

            const decoded = jwt.verify(token, jwtSecret);

            // Check if the user is a superadmin
            const superadmin = await User.findById(decoded.userId);
            if (superadmin && roles.includes('superadmin')) {
                req.user = superadmin;
                return next();
            }

            // Check if the user is a tenant
            const tenant = await Tenant.findById(decoded.userId);
            if (tenant && roles.includes('tenant')) {
                req.tenant = tenant;
                return next();
            }

            const userDbModel = await getUserSpecificCustomerModel(req);
            const customer = await userDbModel.findById(decoded.userId);
            console.log(roles);
            if (customer && roles.includes('customer')) {
                req.customer = customer;
                // Continue to the next middleware when the user is a customer
                return next();
            }
            console.log('User Role:', superadmin ? superadmin.role : 'N/A'); // Check the user's role or 'N/A'
            console.log('Tenant Role:', tenant ? tenant.role : 'N/A');
            console.log('Customer Role:', customer ? customer.role : 'N/A');
            return res.status(403).json({ message: 'Forbidden. Insufficient role privileges.' });

        } catch (error) {
            console.error('Role check error:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    };
};

module.exports = checkRole;

// Middleware to check the user's role (superadmin or tenant)
// const checkRole = (roles) => {
//     return async (req, res, next) => {
//         try {
//             const token = req.cookies.jwtToken;
//             // console.log(token);

//             if (!token) {
//                 return res.status(401).json({ message: 'Authentication failed. Token not found.' });
//             }

//             const decoded = jwt.verify(token, jwtSecret);
//             // console.log(decoded);


//             // Check if the user is a superadmin
//             const superadmin = await User.findById(decoded.userId);
//             if (superadmin && roles.includes('superadmin')) {
//                 req.user = superadmin;
//                 return next();
//             }

//             // Check if the user is a tenant
//             const tenant = await Tenant.findById(decoded.userId);
//             // console.log(tenant);
//             if (tenant && roles.includes('tenant')) {
//                 req.tenant = tenant;
//                 return next();
//             }
//             const userDbModel = await getUserSpecificCustomerModel(req);
//             const customer = await userDbModel.findById(decoded.userId);
//             console.log(customer);
//             if (customer && roles.includes('customer')) {
//                 req.customer = customer;
//                 return next();
//             }

//             console.log('User Role:', superadmin ? superadmin.role : 'N/A'); // Check the user's role or 'N/A'
//             console.log('Tenant Role:', tenant ? tenant.role : 'N/A');
//             console.log('Customer Role:', customer ? customer.role : 'N/A');
//             return res.status(403).json({ message: 'Forbidden. Insufficient role privileges.' });
//         } catch (error) {
//             console.error('Role check error:', error);
//             return res.status(500).json({ message: 'Internal server error.' });
//         }
//     };
// };

// module.exports = checkRole;
