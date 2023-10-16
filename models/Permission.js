const mongoose = require('mongoose');
const permissionSchema = new mongoose.Schema({
    moduleId: [mongoose.Schema.Types.ObjectId],
    tenantId: mongoose.Schema.Types.ObjectId,
    permissions: [String],
});
const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;