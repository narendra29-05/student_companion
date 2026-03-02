const express = require('express');
const router = express.Router();
const { getUnifiedDashboard } = require('../controllers/dashboardController');
const { protectStudent } = require('../middleware/authMiddleware');

router.get('/student', protectStudent, getUnifiedDashboard);

module.exports = router;
