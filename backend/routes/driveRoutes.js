const express = require('express');
const router = express.Router();
const {
    createDrive,
    getAllDrivesFaculty,
    getActiveDrivesStudent,
    updateDrive,
    deleteDrive,
} = require('../controllers/driveController');
const { getMaterialsByFilter } = require('../controllers/materialController');
const { protectFaculty, protectStudent } = require('../middleware/authMiddleware');

// Faculty routes
router.post('/', protectFaculty, createDrive);
router.get('/faculty', protectFaculty, getAllDrivesFaculty);
router.put('/:id', protectFaculty, updateDrive);
router.delete('/:id', protectFaculty, deleteDrive);

// Student routes
router.get('/student', protectStudent, getActiveDrivesStudent);
router.get('/materials/filter', protectStudent, getMaterialsByFilter);

module.exports = router;
