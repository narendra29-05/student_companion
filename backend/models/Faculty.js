const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const { DEPARTMENTS } = require('../config/constants');

const Faculty = sequelize.define('Faculty', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    facultyId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        set(val) {
            this.setDataValue('facultyId', val.toUpperCase().trim());
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
}, {
    tableName: 'faculty',
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

Faculty.beforeCreate(async (faculty) => {
    const salt = await bcrypt.genSalt(10);
    faculty.password = await bcrypt.hash(faculty.password, salt);
});

Faculty.beforeUpdate(async (faculty) => {
    if (faculty.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        faculty.password = await bcrypt.hash(faculty.password, salt);
    }
});

Faculty.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = Faculty;
