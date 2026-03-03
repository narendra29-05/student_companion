const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userType: {
        type: DataTypes.ENUM('student', 'faculty'),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM(
            'new_drive',
            'drive_updated',
            'deadline_reminder',
            'assignment_created',
            'assignment_submitted',
            'welcome'
        ),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    relatedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'notifications',
    timestamps: true,
    updatedAt: false,
    indexes: [
        { fields: ['userId', 'userType'] },
        { fields: ['isRead'] },
    ],
});

module.exports = Notification;
