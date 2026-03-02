const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Todo = sequelize.define('Todo', {
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
    task: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'todos',
    timestamps: true,
    indexes: [
        { fields: ['studentId'] },
    ],
});

module.exports = Todo;
