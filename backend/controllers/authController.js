const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const { sendWelcomeEmail, sendFacultyWelcomeEmail } = require('../utils/emailService');
const { sequelize } = require('../config/db');
const { Drive, DriveEligibleDepartment } = require('../models/Drive');
const DriveApplication = require('../models/DriveApplication');
const { Assignment, AssignmentStudent } = require('../models/Assignment');
const Submission = require('../models/Submission');
const { Material, MaterialUnit } = require('../models/Material');
const Notification = require('../models/Notification');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// ==================== STUDENT AUTH ====================

exports.registerStudent = async (req, res, next) => {
    try {
        const { rollNumber, collegeEmail, password, name, department, year, section } = req.body;

        if (!rollNumber || !collegeEmail || !password || !name || !department || !year) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingStudent = await Student.scope('withPassword').findOne({
            where: { rollNumber: rollNumber.toUpperCase() },
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student already exists with this roll number',
            });
        }

        const emailExists = await Student.findOne({ where: { collegeEmail: collegeEmail.toLowerCase() } });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Student already exists with this email',
            });
        }

        const student = await Student.create({
            rollNumber, collegeEmail, password, name, department, year, section,
        });

        const token = generateToken(student.id);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: student.id,
                rollNumber: student.rollNumber,
                name: student.name,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.collegeEmail,
                department: student.department,
                year: student.year,
                section: student.section,
                cgpa: student.cgpa,
                backlogs: student.backlogs,
                profilePicPath: student.profilePicPath,
                profileCompleted: student.profileCompleted,
                role: 'student',
            },
        });

        // Fire-and-forget welcome email
        sendWelcomeEmail(student).catch(err => console.error('[Email] Welcome email failed:', err.message));
    } catch (error) {
        next(error);
    }
};

exports.loginStudent = async (req, res, next) => {
    try {
        const { rollNumber, password } = req.body;

        if (!rollNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide roll number and password',
            });
        }

        const student = await Student.scope('withPassword').findOne({
            where: { rollNumber: rollNumber.toUpperCase() },
        });

        if (!student || !(await student.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const token = generateToken(student.id);

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: student.id,
                rollNumber: student.rollNumber,
                name: student.name,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.collegeEmail,
                department: student.department,
                year: student.year,
                section: student.section,
                cgpa: student.cgpa,
                backlogs: student.backlogs,
                profilePicPath: student.profilePicPath,
                profileCompleted: student.profileCompleted,
                role: 'student',
            },
        });
    } catch (error) {
        next(error);
    }
};

// ==================== FACULTY AUTH ====================

exports.registerFaculty = async (req, res, next) => {
    try {
        const { facultyId, collegeEmail, password, name, department } = req.body;

        if (!facultyId || !collegeEmail || !password || !name || !department) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingFaculty = await Faculty.scope('withPassword').findOne({
            where: { facultyId: facultyId.toUpperCase() },
        });

        if (existingFaculty) {
            return res.status(400).json({
                success: false,
                message: 'Faculty already exists with this ID',
            });
        }

        const emailExists = await Faculty.findOne({ where: { collegeEmail: collegeEmail.toLowerCase() } });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Faculty already exists with this email',
            });
        }

        const faculty = await Faculty.create({
            facultyId, collegeEmail, password, name, department,
        });

        const token = generateToken(faculty.id);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: faculty.id,
                facultyId: faculty.facultyId,
                name: faculty.name,
                email: faculty.collegeEmail,
                department: faculty.department,
                role: 'faculty',
            },
        });

        // Fire-and-forget welcome email
        sendFacultyWelcomeEmail(faculty).catch(err => console.error('[Email] Faculty welcome email failed:', err.message));
    } catch (error) {
        next(error);
    }
};

exports.loginFaculty = async (req, res, next) => {
    try {
        const { facultyId, password } = req.body;

        if (!facultyId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide faculty ID and password',
            });
        }

        const faculty = await Faculty.scope('withPassword').findOne({
            where: { facultyId: facultyId.toUpperCase() },
        });

        if (!faculty || !(await faculty.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const token = generateToken(faculty.id);

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: faculty.id,
                facultyId: faculty.facultyId,
                name: faculty.name,
                email: faculty.collegeEmail,
                department: faculty.department,
                role: 'faculty',
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete faculty account
// @route   DELETE /api/auth/faculty/account
exports.deleteFacultyAccount = async (req, res, next) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required to delete account' });
        }

        const faculty = await Faculty.scope('withPassword').findByPk(req.faculty.id);

        if (!faculty || !(await faculty.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        const t = await sequelize.transaction();
        try {
            // Get faculty's drives and assignments for cascading deletes
            const driveIds = (await Drive.findAll({ where: { postedBy: faculty.id }, attributes: ['id'], transaction: t })).map(d => d.id);
            const assignmentIds = (await Assignment.findAll({ where: { facultyId: faculty.id }, attributes: ['id'], transaction: t })).map(a => a.id);

            // Delete drive-related data
            if (driveIds.length > 0) {
                await DriveApplication.destroy({ where: { driveId: driveIds }, transaction: t });
                await DriveEligibleDepartment.destroy({ where: { driveId: driveIds }, transaction: t });
                await Drive.destroy({ where: { id: driveIds }, transaction: t });
            }

            // Delete assignment-related data
            if (assignmentIds.length > 0) {
                await Submission.destroy({ where: { assignmentId: assignmentIds }, transaction: t });
                await AssignmentStudent.destroy({ where: { assignmentId: assignmentIds }, transaction: t });
                await Assignment.destroy({ where: { id: assignmentIds }, transaction: t });
            }

            // Delete materials and their units
            const materialIds = (await Material.findAll({ where: { uploadedBy: faculty.id }, attributes: ['id'], transaction: t })).map(m => m.id);
            if (materialIds.length > 0) {
                await MaterialUnit.destroy({ where: { materialId: materialIds }, transaction: t });
                await Material.destroy({ where: { id: materialIds }, transaction: t });
            }

            // Delete notifications
            await Notification.destroy({ where: { userId: faculty.id, userType: 'faculty' }, transaction: t });

            // Delete faculty record
            await faculty.destroy({ transaction: t });
            await t.commit();
        } catch (err) {
            await t.rollback();
            throw err;
        }

        res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        next(error);
    }
};
