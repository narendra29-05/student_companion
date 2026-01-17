const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    task: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    deadline: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);