const Notification = require('../models/Notification');

const createNotification = async ({ userId, userType, type, title, message, relatedId }) => {
    try {
        await Notification.create({ userId, userType, type, title, message, relatedId });
    } catch (error) {
        console.error('[Notification] Failed to create:', error.message);
    }
};

const createBulkNotifications = async (notifications) => {
    try {
        if (notifications.length === 0) return;
        await Notification.bulkCreate(notifications);
    } catch (error) {
        console.error('[Notification] Bulk create failed:', error.message);
    }
};

module.exports = { createNotification, createBulkNotifications };
