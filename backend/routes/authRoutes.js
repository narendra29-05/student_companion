const express = require('express');
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    registerFaculty,
    loginFaculty,
    deleteFacultyAccount,
} = require('../controllers/authController');
const { protectFaculty } = require('../middleware/authMiddleware');

// Student routes
router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);

// Faculty routes
router.post('/faculty/register', registerFaculty);
router.post('/faculty/login', loginFaculty);
router.delete('/faculty/account', protectFaculty, deleteFacultyAccount);

module.exports = router;
