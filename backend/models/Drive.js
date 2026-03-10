const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Drive = sequelize.define('Drive', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    companyName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        set(val) {
            this.setDataValue('companyName', val.trim());
        },
    },
    role: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    driveLink: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    minCGPA: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    package: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    postedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'faculty',
            key: 'id',
        },
    },
    maxBacklogs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'drives',
    timestamps: true,
    getterMethods: {
        isExpired() {
            return new Date() > this.expiryDate;
        },
    },
});

// Junction table for eligible departments
const DriveEligibleDepartment = sequelize.define('DriveEligibleDepartment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    driveId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'drives',
            key: 'id',
        },
    },
    department: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    tableName: 'drive_eligible_departments',
    timestamps: false,
});

Drive.hasMany(DriveEligibleDepartment, { as: 'eligibleDepartments', foreignKey: 'driveId', onDelete: 'CASCADE' });
DriveEligibleDepartment.belongsTo(Drive, { foreignKey: 'driveId' });

module.exports = { Drive, DriveEligibleDepartment };
