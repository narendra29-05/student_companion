const express = require('express');
const router = express.Router();
const { getTodos, addTodo, deleteTodo } = require('../controllers/todoController');
const { protectStudent } = require('../middleware/authMiddleware');

router.get('/', protectStudent, getTodos);
router.post('/', protectStudent, addTodo);
router.delete('/:id', protectStudent, deleteTodo);

module.exports = router;