const express = require('express');
const router = express.Router();

const { 
    createDrive, 
    getAllDrivesFaculty, 
    getActiveDrivesStudent,
    updateDrive,
    deleteDrive 
} = require('../controllers/driveController');

const { protectFaculty, protectStudent } = require('../middleware/authMiddleware');

// Faculty routes
router.post('/', protectFaculty, createDrive);
router.get('/faculty', protectFaculty, getAllDrivesFaculty);
router.put('/:id', protectFaculty, updateDrive);
router.delete('/:id', protectFaculty, deleteDrive);

// Student routes
router.get('/student', protectStudent, getActiveDrivesStudent);

// IMPORTANT: Make sure this line exists!
module.exports = router;
