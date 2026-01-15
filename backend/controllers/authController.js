const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// ==================== STUDENT AUTH ====================

exports.registerStudent = async (req, res, next) => { // Added next
    try {
        const { rollNumber, collegeEmail, password, name, department, year } = req.body;

        const studentExists = await Student.findOne({ 
            $or: [{ rollNumber }, { collegeEmail }] 
        });

        if (studentExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'Student already exists with this roll number or email' 
            });
        }

        const student = await Student.create({
            rollNumber, collegeEmail, password, name, department, year
        });

        const token = generateToken(student._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: student._id,
                rollNumber: student.rollNumber,
                name: student.name,
                email: student.collegeEmail,
                department: student.department,
                year: student.year,
                role: 'student'
            }
        });
    } catch (error) {
        next(error); // Pass to global error handler
    }
};

exports.loginStudent = async (req, res, next) => { // Added next
    try {
        const { rollNumber, password } = req.body;

        if (!rollNumber || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide roll number and password' 
            });
        }

        const student = await Student.findOne({ rollNumber }).select('+password');

        if (!student || !(await student.matchPassword(password))) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const token = generateToken(student._id);

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: student._id,
                rollNumber: student.rollNumber,
                name: student.name,
                email: student.collegeEmail,
                department: student.department,
                year: student.year,
                role: 'student'
            }
        });
    } catch (error) {
        next(error); // Pass to global error handler
    }
};

// ==================== FACULTY AUTH ====================

exports.registerFaculty = async (req, res, next) => { // Added next
    try {
        const { facultyId, collegeEmail, password, name, department } = req.body;

        const facultyExists = await Faculty.findOne({ 
            $or: [{ facultyId }, { collegeEmail }] 
        });

        if (facultyExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'Faculty already exists with this ID or email' 
            });
        }

        const faculty = await Faculty.create({
            facultyId, collegeEmail, password, name, department
        });

        const token = generateToken(faculty._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: faculty._id,
                facultyId: faculty.facultyId,
                name: faculty.name,
                email: faculty.collegeEmail,
                department: faculty.department,
                role: 'faculty'
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.loginFaculty = async (req, res, next) => { // Added next
    try {
        const { facultyId, password } = req.body;

        if (!facultyId || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide faculty ID and password' 
            });
        }

        const faculty = await Faculty.findOne({ facultyId }).select('+password');

        if (!faculty || !(await faculty.matchPassword(password))) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const token = generateToken(faculty._id);

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: faculty._id,
                facultyId: faculty.facultyId,
                name: faculty.name,
                email: faculty.collegeEmail,
                department: faculty.department,
                role: 'faculty'
            }
        });
    } catch (error) {
        next(error);
    }
};