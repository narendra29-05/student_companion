const express = require('express');
const router = express.Router();
const { protectAny } = require('../middleware/authMiddleware');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
} = require('../controllers/notificationController');

router.get('/', protectAny, getNotifications);
router.patch('/read-all', protectAny, markAllAsRead);
router.patch('/:id/read', protectAny, markAsRead);

module.exports = router;
