const { sequelize } = require('../config/db');
const Student = require('./Student');
const Faculty = require('./Faculty');
const { Material, MaterialUnit } = require('./Material');
const Todo = require('./Todo');
const { Drive, DriveEligibleDepartment } = require('./Drive');

// Student associations
Student.hasMany(Todo, { foreignKey: 'studentId', as: 'todos' });
Todo.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Faculty associations
Faculty.hasMany(Drive, { foreignKey: 'postedBy', as: 'drives' });
Drive.belongsTo(Faculty, { foreignKey: 'postedBy', as: 'faculty' });

Faculty.hasMany(Material, { foreignKey: 'uploadedBy', as: 'materials' });
Material.belongsTo(Faculty, { foreignKey: 'uploadedBy', as: 'uploadedByFaculty' });

// Sync all models with database
const syncDB = async () => {
    try {
        await sequelize.sync();
        console.log('All tables synced successfully');
    } catch (error) {
        console.error('Table sync failed:', error.message);
        throw error;
    }
};

module.exports = {
    sequelize,
    syncDB,
    Student,
    Faculty,
    Material,
    MaterialUnit,
    Todo,
    Drive,
    DriveEligibleDepartment,
};
