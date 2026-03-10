const { sequelize } = require('../config/db');
const Student = require('./Student');
const Faculty = require('./Faculty');
const { Material, MaterialUnit } = require('./Material');
const Todo = require('./Todo');
const { Drive, DriveEligibleDepartment } = require('./Drive');
const DriveApplication = require('./DriveApplication');
const { Assignment, AssignmentStudent } = require('./Assignment');
const Submission = require('./Submission');
const Notification = require('./Notification');

// Student associations
Student.hasMany(Todo, { foreignKey: 'studentId', as: 'todos' });
Todo.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Faculty associations
Faculty.hasMany(Drive, { foreignKey: 'postedBy', as: 'drives' });
Drive.belongsTo(Faculty, { foreignKey: 'postedBy', as: 'faculty' });

Faculty.hasMany(Material, { foreignKey: 'uploadedBy', as: 'materials' });
Material.belongsTo(Faculty, { foreignKey: 'uploadedBy', as: 'uploadedByFaculty' });

// DriveApplication associations
Student.hasMany(DriveApplication, { foreignKey: 'studentId', as: 'driveApplications' });
DriveApplication.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Drive.hasMany(DriveApplication, { foreignKey: 'driveId', as: 'applications' });
DriveApplication.belongsTo(Drive, { foreignKey: 'driveId', as: 'drive' });

// Assignment associations
Faculty.hasMany(Assignment, { foreignKey: 'facultyId', as: 'assignments' });
Assignment.belongsTo(Faculty, { foreignKey: 'facultyId', as: 'faculty' });

Student.hasMany(AssignmentStudent, { foreignKey: 'studentId', as: 'assignedAssignments' });
AssignmentStudent.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Submission associations
Student.hasMany(Submission, { foreignKey: 'studentId', as: 'submissions' });
Submission.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Assignment.hasMany(Submission, { foreignKey: 'assignmentId', as: 'submissions', onDelete: 'CASCADE' });
Submission.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });

// Sync all models with database
const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true });
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
    DriveApplication,
    Assignment,
    AssignmentStudent,
    Submission,
    Notification,
};
