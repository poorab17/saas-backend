// backend/utils/tenantDBs.js
const mongoose = require('mongoose');

const tenantDBs = {}; // Object to store connections to tenant databases

const getTenantDBUri = (username) => {
    // Create and return the database URI based on the username
    return `mongodb://localhost:27017/${username}`;
};

const connectToTenantDB = (username) => {
    if (!tenantDBs[username]) {
        // If the connection doesn't exist, create it
        const uri = getTenantDBUri(username);
        const connection = mongoose.createConnection(uri);
        tenantDBs[username] = connection;
    }
    return tenantDBs[username];
};

module.exports = { connectToTenantDB };
