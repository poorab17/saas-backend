const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    tenantName: {
        type: String,
        required: true,
    },
    moduleName: {
        type: [String],
        required: true,
    },
    rbac: {
        type: [String],
        enum: ['view', 'edit', 'delete'],
        required: true,
    },
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
