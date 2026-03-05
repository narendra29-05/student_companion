const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    uploadResume,
    deleteResume,
    uploadProfilePic,
    deleteProfilePic,
    deleteAccount,
} = require('../controllers/studentController');
const { protectStudent } = require('../middleware/authMiddleware');
const { uploadResume: resumeUpload, uploadProfilePic: picUpload } = require('../middleware/upload');

router.get('/profile', protectStudent, getProfile);
router.put('/profile', protectStudent, updateProfile);
router.post('/profile/resume', protectStudent, resumeUpload.single('resume'), uploadResume);
router.delete('/profile/resume', protectStudent, deleteResume);
router.post('/profile/picture', protectStudent, picUpload.single('profilePic'), uploadProfilePic);
router.delete('/profile/picture', protectStudent, deleteProfilePic);
router.delete('/account', protectStudent, deleteAccount);

module.exports = router;
