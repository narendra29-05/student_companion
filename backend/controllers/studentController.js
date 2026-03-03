const cloudinary = require('../config/cloudinary');
const Student = require('../models/Student');

// Extract Cloudinary public_id from a full URL
const getPublicId = (url) => {
    if (!url) return null;
    // Cloudinary URLs: https://res.cloudinary.com/<cloud>/image/upload/v123/folder/file.ext
    // or for raw: https://res.cloudinary.com/<cloud>/raw/upload/v123/folder/file.ext
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? match[1] : null;
};

const buildProfileResponse = (student) => ({
    id: student.id,
    rollNumber: student.rollNumber,
    email: student.collegeEmail,
    name: student.name,
    firstName: student.firstName,
    lastName: student.lastName,
    department: student.department,
    year: student.year,
    section: student.section,
    cgpa: student.cgpa,
    backlogs: student.backlogs,
    resumePath: student.resumePath,
    profilePicPath: student.profilePicPath,
    profileCompleted: student.profileCompleted,
});

// @desc    Get student profile
// @route   GET /api/student/profile
exports.getProfile = async (req, res, next) => {
    try {
        const student = await Student.findByPk(req.student.id);
        res.status(200).json({ success: true, profile: buildProfileResponse(student) });
    } catch (error) {
        next(error);
    }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, cgpa, backlogs, section } = req.body;
        const student = await Student.findByPk(req.student.id);

        await student.update({
            firstName: firstName !== undefined ? firstName : student.firstName,
            lastName: lastName !== undefined ? lastName : student.lastName,
            cgpa: cgpa !== undefined ? cgpa : student.cgpa,
            backlogs: backlogs !== undefined ? backlogs : student.backlogs,
            section: section !== undefined ? section : student.section,
        });

        // Auto-set profileCompleted
        const isComplete = !!(student.firstName && student.lastName && student.cgpa !== null);
        if (student.profileCompleted !== isComplete) {
            await student.update({ profileCompleted: isComplete });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            profile: buildProfileResponse(student),
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload resume
// @route   POST /api/student/profile/resume
exports.uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const student = await Student.findByPk(req.student.id);

        // Delete old resume from Cloudinary
        if (student.resumePath) {
            const publicId = getPublicId(student.resumePath);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }).catch(() => {});
            }
        }

        // req.file.path is the full Cloudinary URL
        const resumePath = req.file.path;
        await student.update({ resumePath });

        res.status(200).json({ success: true, message: 'Resume uploaded successfully!', resumePath });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete resume
// @route   DELETE /api/student/profile/resume
exports.deleteResume = async (req, res, next) => {
    try {
        const student = await Student.findByPk(req.student.id);

        if (!student.resumePath) {
            return res.status(400).json({ success: false, message: 'No resume to delete' });
        }

        const publicId = getPublicId(student.resumePath);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }).catch(() => {});
        }

        await student.update({ resumePath: null });
        res.status(200).json({ success: true, message: 'Resume deleted successfully!' });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload profile picture
// @route   POST /api/student/profile/picture
exports.uploadProfilePic = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        const student = await Student.findByPk(req.student.id);

        // Delete old picture from Cloudinary
        if (student.profilePicPath) {
            const publicId = getPublicId(student.profilePicPath);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch(() => {});
            }
        }

        // req.file.path is the full Cloudinary URL
        const profilePicPath = req.file.path;
        await student.update({ profilePicPath });

        res.status(200).json({ success: true, message: 'Profile picture uploaded!', profilePicPath });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete profile picture
// @route   DELETE /api/student/profile/picture
exports.deleteProfilePic = async (req, res, next) => {
    try {
        const student = await Student.findByPk(req.student.id);

        if (!student.profilePicPath) {
            return res.status(400).json({ success: false, message: 'No profile picture to delete' });
        }

        const publicId = getPublicId(student.profilePicPath);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch(() => {});
        }

        await student.update({ profilePicPath: null });
        res.status(200).json({ success: true, message: 'Profile picture deleted!' });
    } catch (error) {
        next(error);
    }
};
