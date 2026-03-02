const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const { DEPARTMENTS } = require('../config/constants');

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
            isCollegeEmail(value) {
                if (!/^[\w.-]+@[\w-]+\.(edu|ac\.in|edu\.in)$/i.test(value)) {
                    throw new Error('Please use a valid college email');
                }
            },
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
    section: {
        type: DataTypes.STRING(5),
        allowNull: true,
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
