const multer = require('multer');
const path = require('path');

// Resume upload config
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/resumes'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.student.id}_${Date.now()}${ext}`);
    },
});

const resumeFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
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

// Profile picture upload config
const profilePicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/profilepics'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.student.id}_${Date.now()}${ext}`);
    },
});

const profilePicFilter = (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpg, .jpeg, .png, and .webp files are allowed'), false);
    }
};

const uploadProfilePic = multer({
    storage: profilePicStorage,
    fileFilter: profilePicFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = { uploadResume, uploadProfilePic };
