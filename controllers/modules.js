// backend/controllers/modules.js

const Module = require('../models/Module');
const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
// Create a new module and its dynamic route
exports.createModule = async (req, res) => {
    try {

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, '../../frontend/public/images/'))
                console.log(__dirname, "dore")  //E:\userrole\multi-saas\frontend\public
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + file.originalname); // Define the filename
            }
        });

        const upload = multer({ storage: storage });

        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                return res.status(500).json({ message: 'Error uploading file.' });
            }

            const { name, description } = req.body;
            const module = new Module({ name, description });
            module.file = {
                filename: req.file.filename, // Add the filename to your module schema
                path: req.file.path, // Add the file path to your module schema
            };
            await module.save();

            // Dynamically create a new route based on the module name
            const moduleRouter = express.Router();
            moduleRouter.get('/', async (req, res) => {
                try {
                    const moduleName = req.params.moduleName; // Access the module name from the URL
                    const moduleData = await Module.findOne({ name: moduleName });
                    res.json(moduleData);
                } catch (error) {
                    console.error('Error fetching module data:', error);
                    res.status(500).json({ message: 'Internal server error.' });
                }
            });

            // Mount the dynamic route under a common base path
            router.use('/:moduleName', moduleRouter);

            res.status(201).json(module);
        });
    } catch (error) {
        console.error('Error creating module:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Get all modules
exports.getAllModules = async (req, res) => {
    try {
        const modules = await Module.find();
        res.status(200).json(modules);
    } catch (error) {
        console.error('Error fetching modules:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// exports.getModuleByName = async (req, res) => {
//     try {
//         const moduleName = req.params.moduleName; // Access the module name from the URL
//         const moduleData = await Module.findOne({ name: moduleName });
//         res.json(moduleData);
//     } catch (error) {
//         console.error('Error fetching module data:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// };

exports.getModuleById = async (req, res) => {
    try {
        const moduleId = req.params.moduleId; // Access the module ID from the URL
        const moduleData = await Module.findById(moduleId);
        if (!moduleData) {
            // If the module with the given ID is not found, return a 404 response
            return res.status(404).json({ message: 'Module not found.' });
        }
        res.json(moduleData);
    } catch (error) {
        console.error('Error fetching module data:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// update module
exports.updateModule = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const updateData = req.body; // Data to update the module
        // Use the module's ID to find and update it in the database
        const updatedModule = await Module.findByIdAndUpdate(moduleId, updateData, { new: true });
        if (!updatedModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        return res.status(200).json(updatedModule);
    } catch (error) {
        console.error('Error updating module:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.delete = async (req, res) => {
    try {
        // Find the module by its ID
        const module = await Module.findByIdAndRemove(req.params.moduleId);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.json({ message: 'Module deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Add more controller functions for updating, deleting, and other module-related operations as needed.
