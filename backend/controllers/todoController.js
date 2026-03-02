const Todo = require('../models/Todo');

exports.getTodos = async (req, res, next) => {
    try {
        const todos = await Todo.findAll({
            where: { studentId: req.student.id },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({ success: true, todos });
    } catch (error) {
        next(error);
    }
};

exports.addTodo = async (req, res, next) => {
    try {
        const { task, deadline } = req.body;

        if (!task) {
            return res.status(400).json({ success: false, message: 'Task is required' });
        }

        const todo = await Todo.create({
            task,
            deadline: deadline || null,
            studentId: req.student.id,
        });

        res.status(201).json({ success: true, todo });
    } catch (error) {
        next(error);
    }
};

exports.toggleTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findOne({
            where: { id: req.params.id, studentId: req.student.id },
        });

        if (!todo) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        todo.isCompleted = !todo.isCompleted;
        await todo.save();

        res.status(200).json({ success: true, todo });
    } catch (error) {
        next(error);
    }
};

exports.deleteTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findOne({
            where: { id: req.params.id, studentId: req.student.id },
        });

        if (!todo) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        await todo.destroy();
        res.status(200).json({ success: true, message: 'Task removed' });
    } catch (error) {
        next(error);
    }
};
