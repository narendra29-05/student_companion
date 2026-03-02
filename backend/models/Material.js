const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { DEPARTMENTS, REGULATIONS, SEMESTERS } = require('../config/constants');

const Material = sequelize.define('Material', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    regulation: {
        type: DataTypes.STRING(5),
        defaultValue: 'R20',
        validate: {
            isIn: [REGULATIONS],
        },
    },
    semester: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
            isIn: [SEMESTERS],
        },
    },
    subject: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
            isIn: [DEPARTMENTS],
        },
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 4,
        },
    },
    syllabusLink: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'faculty',
            key: 'id',
        },
    },
}, {
    tableName: 'materials',
    timestamps: true,
});

const MaterialUnit = sequelize.define('MaterialUnit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    materialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'materials',
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
}, {
    tableName: 'material_units',
    timestamps: false,
});

// Associations
Material.hasMany(MaterialUnit, { as: 'units', foreignKey: 'materialId', onDelete: 'CASCADE' });
MaterialUnit.belongsTo(Material, { foreignKey: 'materialId' });

module.exports = { Material, MaterialUnit };
