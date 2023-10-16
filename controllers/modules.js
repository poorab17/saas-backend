// backend/controllers/modules.js

const Module = require('../models/Module');

const express = require("express");
const router = express.Router();

// Create a new module and its dynamic route
exports.createModule = async (req, res) => {
    try {
        const { name, description } = req.body;
        const module = new Module({ name, description });
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


exports.getModuleByName = async (req, res) => {
    try {
        const moduleName = req.params.moduleName; // Access the module name from the URL
        const moduleData = await Module.findOne({ name: moduleName });
        res.json(moduleData);
    } catch (error) {
        console.error('Error fetching module data:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Add more controller functions for updating, deleting, and other module-related operations as needed.
