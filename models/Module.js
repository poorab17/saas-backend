// backend/models/Module.js

const mongoose = require('mongoose');


const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    // You can add more fields for file metadata if needed
});

const moduleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: String,
    file: fileSchema,
});

module.exports = mongoose.model('Module', moduleSchema);
