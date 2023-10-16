// backend/models/Tenant.js

const mongoose = require('mongoose');
const Permission = require('./Permission');
const bcrypt = require('bcrypt');

const tenantSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    description: String,

    role: {
        type: String,
        enum: ['superadmin', 'tenant', 'user'],
        default: 'tenant',
    },

    permissions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Permission',
    },

    dbUri: {
        type: String,
        required: true,
    },

});



const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
