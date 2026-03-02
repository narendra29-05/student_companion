const express = require('express');
const router = express.Router();
const { getTodos, addTodo, toggleTodo, deleteTodo } = require('../controllers/todoController');
const { protectStudent } = require('../middleware/authMiddleware');

router.get('/', protectStudent, getTodos);
router.post('/', protectStudent, addTodo);
router.patch('/:id/toggle', protectStudent, toggleTodo);
router.delete('/:id', protectStudent, deleteTodo);

module.exports = router;
