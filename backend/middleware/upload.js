const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Resume upload config — stored as raw files in Cloudinary
const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'student_companion/resumes',
        resource_type: 'raw',
        allowed_formats: ['pdf', 'doc', 'docx'],
    },
});

const resumeFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.originalname.split('.').pop().toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only .pdf, .doc, and .docx files are allowed'), false);
    }
};

const uploadResume = multer({
    storage: resumeStorage,
    fileFilter: resumeFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Profile picture upload config — stored as images in Cloudinary
const profilePicStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'student_companion/profilepics',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'limit', quality: 'auto' }],
    },
});

const profilePicFilter = (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = '.' + file.originalname.split('.').pop().toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpg, .jpeg, .png, and .webp files are allowed'), false);
    }
};

const uploadProfilePic = multer({
    storage: profilePicStorage,
    fileFilter: profilePicFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = { uploadResume, uploadProfilePic };
