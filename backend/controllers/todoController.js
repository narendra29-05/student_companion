const Todo = require('../models/Todo');

exports.getTodos = async (req, res) => {
    try {
        // Use req.student._id as set by your authMiddleware
        const todos = await Todo.find({ student: req.student._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, todos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addTodo = async (req, res) => {
    try {
        const todo = await Todo.create({
            task: req.body.task,
            student: req.student._id
        });
        res.status(201).json({ success: true, todo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ success: false, message: 'Task not found' });
        
        await todo.deleteOne();
        res.status(200).json({ success: true, message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};