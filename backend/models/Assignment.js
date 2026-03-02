const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Assignment = sequelize.define('Assignment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        set(val) {
            this.setDataValue('title', val.trim());
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    facultyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'faculty',
            key: 'id',
        },
    },
}, {
    tableName: 'assignments',
    timestamps: true,
});

const AssignmentStudent = sequelize.define('AssignmentStudent', {
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
}, {
    tableName: 'assignment_students',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['assignmentId', 'studentId'],
        },
    ],
});

// Local associations
Assignment.hasMany(AssignmentStudent, { as: 'assignedStudents', foreignKey: 'assignmentId', onDelete: 'CASCADE' });
AssignmentStudent.belongsTo(Assignment, { foreignKey: 'assignmentId' });

module.exports = { Assignment, AssignmentStudent };
