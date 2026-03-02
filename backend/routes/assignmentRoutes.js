const express = require('express');
const router = express.Router();
const {
    createAssignment,
    getFacultyAssignments,
    getAssignmentSubmissions,
    deleteAssignment,
    searchStudents,
    getStudentAssignments,
    submitAssignment,
    updateSubmission,
} = require('../controllers/assignmentController');
const { protectFaculty, protectStudent } = require('../middleware/authMiddleware');

// Faculty routes
router.post('/', protectFaculty, createAssignment);
router.get('/faculty', protectFaculty, getFacultyAssignments);
router.get('/students/search', protectFaculty, searchStudents);
router.get('/:id/submissions', protectFaculty, getAssignmentSubmissions);
router.delete('/:id', protectFaculty, deleteAssignment);

// Student routes
router.get('/student', protectStudent, getStudentAssignments);
router.post('/:id/submit', protectStudent, submitAssignment);
router.put('/:id/submit', protectStudent, updateSubmission);

module.exports = router;
