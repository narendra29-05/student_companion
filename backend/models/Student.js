const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const { DEPARTMENTS, CAMPUSES } = require('../config/constants');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rollNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        set(val) {
            this.setDataValue('rollNumber', val.toUpperCase().trim());
        },
    },
    collegeEmail: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
        set(val) {
            this.setDataValue('collegeEmail', val.toLowerCase().trim());
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [6, 255],
        },
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        set(val) {
            this.setDataValue('name', val.trim());
        },
    },
    department: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            isIn: [DEPARTMENTS],
        },
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 4,
        },
    },
    campus: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
            isIn: [CAMPUSES],
        },
    },
    section: {
        type: DataTypes.STRING(5),
        allowNull: true,
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    cgpa: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
            max: 10,
        },
    },
    backlogs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    resumePath: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    profilePicPath: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    profileCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'students',
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ['password'] },
    },
    scopes: {
        withPassword: {
            attributes: { include: ['password'] },
        },
    },
});

// Hash password before create/update
Student.beforeCreate(async (student) => {
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);
});

Student.beforeUpdate(async (student) => {
    if (student.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(student.password, salt);
    }
});

// Instance method to compare passwords
Student.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = Student;
