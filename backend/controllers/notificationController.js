const Notification = require('../models/Notification');
const { Op } = require('sequelize');

// @desc    Get user's notifications
// @route   GET /api/notifications
exports.getNotifications = async (req, res, next) => {
    try {
        const { userId, userType } = req.notificationUser;

        const notifications = await Notification.findAll({
            where: { userId, userType },
            order: [['createdAt', 'DESC']],
            limit: 50,
        });

        const unreadCount = await Notification.count({
            where: { userId, userType, isRead: false },
        });

        res.status(200).json({ success: true, notifications, unreadCount });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark one notification as read
// @route   PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
    try {
        const { userId, userType } = req.notificationUser;

        const notification = await Notification.findOne({
            where: { id: req.params.id, userId, userType },
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        await notification.update({ isRead: true });
        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
exports.markAllAsRead = async (req, res, next) => {
    try {
        const { userId, userType } = req.notificationUser;

        await Notification.update(
            { isRead: true },
            { where: { userId, userType, isRead: false } }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
};
