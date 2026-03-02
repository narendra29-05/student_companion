const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

// Protect routes - Student
exports.protectStudent = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findByPk(decoded.id);

        if (!student) {
            return res.status(401).json({ success: false, message: 'Student not found' });
        }

        req.student = student;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

// Protect routes - Faculty
exports.protectFaculty = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const faculty = await Faculty.findByPk(decoded.id);

        if (!faculty) {
            return res.status(401).json({ success: false, message: 'Faculty not found' });
        }

        req.faculty = faculty;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};
