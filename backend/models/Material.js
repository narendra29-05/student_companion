const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    regulation: { type: String, default: 'R20' },
    semester: { type: String, required: true }, // e.g., '1-1', '2-1'
    subject: { type: String, required: true },
    units: [{
        name: { type: String, required: true }, // e.g., 'Unit 1'
        link: { type: String, required: true }  // Google Drive Link
    }],
    syllabusLink: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);