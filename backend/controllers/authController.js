const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const { sendWelcomeEmail, sendFacultyWelcomeEmail } = require('../utils/emailService');

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
