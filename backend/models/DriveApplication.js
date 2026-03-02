const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DriveApplication = sequelize.define('DriveApplication', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id',
        },
    },
    driveId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'drives',
            key: 'id',
        },
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'interested',
        validate: {
            isIn: [['interested', 'applied']],
        },
    },
}, {
    tableName: 'drive_applications',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['studentId', 'driveId'],
        },
    ],
});

module.exports = DriveApplication;
