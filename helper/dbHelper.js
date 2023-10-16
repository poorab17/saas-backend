const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require('../config/auth');

// Function to get the user-specific Customer model
const getUserSpecificCustomerModel = async (req) => {
    return new Promise(async (resolve, reject) => {
        let databasename;

        // Create a connection to the CustomerTenant database
        const customerTenantConnection = mongoose.createConnection(`mongodb://127.0.0.1:27017/customerTenantDB`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        customerTenantConnection.on('connected', async () => {
            console.log('Connected to CustomerTenant database');

            const customerTenantCollection = customerTenantConnection.collection('customerTenant');

            // Extract the username from the JWT token
            const token = req.cookies.jwtToken; // Assuming the JWT token is stored in a cookie

            if (!token) {
                return reject({ message: 'JWT token is missing.' });
            }

            const decoded = jwt.verify(token, jwtSecret);
            const username = decoded.username;

            // Use a query object to match documents based on the 'username' field
            const query = { username };

            const databasenameEntry = await customerTenantCollection.findOne(query);

            if (databasenameEntry) {
                databasename = databasenameEntry.databaseName;
                console.log('Found databasename:', databasename);

                // Create a connection to the user-specific database
                const userDbConnection = mongoose.createConnection(`mongodb://127.0.0.1:27017/${databasename}`, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });

                // Define and return the Customer model
                const Customer = userDbConnection.model('Customer', new mongoose.Schema({
                    // Define your Customer schema here
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

                resolve(Customer);
            } else {
                reject({ message: 'User-specific database not found.' });
            }
        });
    });
};

module.exports = getUserSpecificCustomerModel;
