const express = require('express');
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    registerFaculty,
    loginFaculty,
} = require('../controllers/authController');

// Student routes
router.post('/student/register', registerStudent);
router.post('/student/login', loginStudent);

// Faculty routes
router.post('/faculty/register', registerFaculty);
router.post('/faculty/login', loginFaculty);

module.exports = router;
