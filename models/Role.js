// backend/models/Role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    permissions: [String],
    tenantId: String,
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
