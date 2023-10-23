
const mongoose = require("mongoose");
const Permission = require('../models/Permission');
const Tenant = require('../models/Tenant');

// Grant permissions for a module to a tenant (superadmin only)
exports.grantPermission = async (req, res) => {
    try {
        const { moduleName, tenantName, rbac } = req.body;

        // Create a new permission in the default database
        const permission = new Permission({
            moduleName,
            tenantName, // 'default' for the default database
            rbac,
        });
        await permission.save();

        // Dynamically create a connection to the tenant's database and store the permission
        const tenant = await Tenant.findOne({ name: tenantName });
        if (tenant) {
            const tenantDbUri = `mongodb://127.0.0.1:27017/${tenant.name}`;
            const tenantDbConnection = mongoose.createConnection(tenantDbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            const TenantPermission = tenantDbConnection.model('Permission', Permission.schema);

            const tenantPermission = new TenantPermission({
                moduleName,
                tenantName,
                rbac,
            });

            await tenantPermission.save();

            res.status(201).json({ defaultPermission: permission, tenantPermission: tenantPermission });
        } else {
            res.status(404).json({ message: 'Tenant not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error granting permissions.' });
    }
};

