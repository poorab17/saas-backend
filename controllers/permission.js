const Permission = require('../models/Permission');
// Grant permissions for a module to a tenant (superadmin only)
exports.grantPermission = async (req, res) => {
    try {
        const { moduleId, tenantId, permissions } = req.body;
        const permission = new Permission({ moduleId, tenantId, permissions });
        await permission.save();
        res.status(201).json(permission);
    } catch (error) {
        res.status(500).json({ message: 'Error granting permissions.' });
    }
};