const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Submission = sequelize.define('Submission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    assignmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'assignments',
            key: 'id',
        },
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id',
        },
    },
    driveLink: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
            isUrl: true,
            isDriveLink(value) {
                if (!value.includes('drive.google.com')) {
                    throw new Error('Link must be a valid Google Drive URL');
                }
            },
        },
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'submitted',
        validate: {
            isIn: [['submitted', 'late']],
        },
    },
}, {
    tableName: 'submissions',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['assignmentId', 'studentId'],
        },
    ],
});

module.exports = Submission;
