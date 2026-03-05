const { Op } = require('sequelize');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const { Assignment, AssignmentStudent } = require('../models/Assignment');
const Submission = require('../models/Submission');
const { sendSubmissionNotification, notifyAssignmentAssigned } = require('../utils/emailService');

// ==================== FACULTY ====================

// POST /api/assignments — Create assignment
exports.createAssignment = async (req, res, next) => {
    try {
        const { title, description, deadline, rollNumbers } = req.body;

        if (!title || !deadline || !rollNumbers || !Array.isArray(rollNumbers) || rollNumbers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Title, deadline, and at least one roll number are required',
            });
        }

        // Normalize roll numbers to uppercase
        const normalized = rollNumbers.map((r) => r.toUpperCase());

        // Validate all roll numbers exist
        const students = await Student.findAll({
            where: { rollNumber: normalized },
            attributes: ['id', 'rollNumber'],
        });

        const foundRolls = students.map((s) => s.rollNumber);
        const invalid = normalized.filter((r) => !foundRolls.includes(r));

        if (invalid.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Roll numbers not found: ${invalid.join(', ')}`,
            });
        }

        const assignment = await Assignment.create({
            title,
            description,
            deadline,
            facultyId: req.faculty.id,
        });

        // Bulk create junction records
        await AssignmentStudent.bulkCreate(
            students.map((s) => ({ assignmentId: assignment.id, studentId: s.id }))
        );

        // Refetch with associations
        const full = await Assignment.findByPk(assignment.id, {
            include: [
                {
                    model: AssignmentStudent,
                    as: 'assignedStudents',
                    include: [{ model: Student, as: 'student', attributes: ['id', 'rollNumber', 'name', 'department'] }],
                },
            ],
        });

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully!',
            assignment: full,
        });

        // Fire-and-forget: notify all assigned students via email
        const fullStudents = await Student.findAll({
            where: { id: students.map((s) => s.id) },
        });
        notifyAssignmentAssigned(assignment, fullStudents, req.faculty).catch(err => console.error('[Email] Assignment notification failed:', err.message));
    } catch (error) {
        next(error);
    }
};

// GET /api/assignments/faculty — List faculty's assignments
exports.getFacultyAssignments = async (req, res, next) => {
    try {
        const assignments = await Assignment.findAll({
            where: { facultyId: req.faculty.id },
            include: [
                {
                    model: AssignmentStudent,
                    as: 'assignedStudents',
                    include: [{ model: Student, as: 'student', attributes: ['id', 'rollNumber', 'name', 'department'] }],
                },
                {
                    model: Submission,
                    as: 'submissions',
                    include: [{ model: Student, as: 'student', attributes: ['id', 'rollNumber', 'name'] }],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({ success: true, count: assignments.length, assignments });
    } catch (error) {
        next(error);
    }
};

// GET /api/assignments/students/search?q= — Search students by roll number
exports.searchStudents = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.status(200).json({ success: true, students: [] });
        }

        const students = await Student.findAll({
            where: {
                rollNumber: { [Op.like]: `%${q.toUpperCase()}%` },
            },
            attributes: ['id', 'rollNumber', 'name', 'department', 'year'],
            limit: 20,
        });

        res.status(200).json({ success: true, students });
    } catch (error) {
        next(error);
    }
};

// GET /api/assignments/:id/submissions — View submissions for an assignment
exports.getAssignmentSubmissions = async (req, res, next) => {
    try {
        const assignment = await Assignment.findOne({
            where: { id: req.params.id, facultyId: req.faculty.id },
        });

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        // Get all assigned students
        const assigned = await AssignmentStudent.findAll({
            where: { assignmentId: assignment.id },
            include: [{ model: Student, as: 'student', attributes: ['id', 'rollNumber', 'name', 'department', 'collegeEmail'] }],
        });

        // Get all submissions
        const submissions = await Submission.findAll({
            where: { assignmentId: assignment.id },
            include: [{ model: Student, as: 'student', attributes: ['id', 'rollNumber', 'name', 'department'] }],
            order: [['submittedAt', 'DESC']],
        });

        const submittedStudentIds = submissions.map((s) => s.studentId);
        const notSubmitted = assigned
            .filter((a) => !submittedStudentIds.includes(a.studentId))
            .map((a) => a.student);

        res.status(200).json({
            success: true,
            assignment,
            submissions,
            notSubmitted,
            totalAssigned: assigned.length,
            totalSubmitted: submissions.length,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/assignments/:id — Delete assignment
exports.deleteAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findOne({
            where: { id: req.params.id, facultyId: req.faculty.id },
        });

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        await assignment.destroy();

        res.status(200).json({ success: true, message: 'Assignment deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// ==================== STUDENT ====================

// GET /api/assignments/student — List assignments for this student
exports.getStudentAssignments = async (req, res, next) => {
    try {
        const assignments = await Assignment.findAll({
            include: [
                {
                    model: AssignmentStudent,
                    as: 'assignedStudents',
                    where: { studentId: req.student.id },
                    required: true,
                    attributes: [],
                },
                {
                    model: Faculty,
                    as: 'faculty',
                    attributes: ['id', 'name', 'department'],
                },
                {
                    model: Submission,
                    as: 'submissions',
                    where: { studentId: req.student.id },
                    required: false,
                },
            ],
            order: [['deadline', 'ASC']],
        });

        // Enrich with status info
        const enriched = assignments.map((a) => {
            const plain = a.toJSON();
            const submission = plain.submissions?.[0] || null;
            const isPastDeadline = new Date() > new Date(plain.deadline);

            let submissionStatus = 'not_submitted';
            if (submission) {
                submissionStatus = submission.status; // 'submitted' or 'late'
            }

            return {
                ...plain,
                submission,
                submissionStatus,
                isPastDeadline,
            };
        });

        res.status(200).json({ success: true, count: enriched.length, assignments: enriched });
    } catch (error) {
        next(error);
    }
};

// POST /api/assignments/:id/submit — Submit assignment
exports.submitAssignment = async (req, res, next) => {
    try {
        const { driveLink, comments } = req.body;

        if (!driveLink || !driveLink.trim()) {
            return res.status(400).json({ success: false, message: 'Google Drive link is required' });
        }

        if (!driveLink.includes('drive.google.com')) {
            return res.status(400).json({ success: false, message: 'Must be a valid Google Drive URL (drive.google.com)' });
        }

        const assignment = await Assignment.findByPk(req.params.id);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        // Check student is assigned
        const isAssigned = await AssignmentStudent.findOne({
            where: { assignmentId: assignment.id, studentId: req.student.id },
        });
        if (!isAssigned) {
            return res.status(403).json({ success: false, message: 'You are not assigned to this assignment' });
        }

        // Check if already submitted
        const existing = await Submission.findOne({
            where: { assignmentId: assignment.id, studentId: req.student.id },
        });

        const isPastDeadline = new Date() > new Date(assignment.deadline);
        const status = isPastDeadline ? 'late' : 'submitted';

        if (existing) {
            // Edit existing — only if before deadline
            if (isPastDeadline) {
                return res.status(400).json({ success: false, message: 'Cannot edit submission after deadline' });
            }

            existing.driveLink = driveLink;
            existing.comments = comments || null;
            existing.submittedAt = new Date();
            existing.status = status;
            await existing.save();

            res.status(200).json({
                success: true,
                message: 'Submission updated successfully!',
                submission: existing,
            });
        } else {
            // New submission
            const submission = await Submission.create({
                assignmentId: assignment.id,
                studentId: req.student.id,
                driveLink,
                comments: comments || null,
                submittedAt: new Date(),
                status,
            });

            res.status(201).json({
                success: true,
                message: isPastDeadline ? 'Submitted (late)' : 'Assignment submitted successfully!',
                submission,
            });
        }

        // Fire-and-forget email to faculty
        const faculty = await Faculty.findByPk(assignment.facultyId);
        if (faculty) {
            sendSubmissionNotification(faculty, req.student, assignment, {
                driveLink,
                comments,
                submittedAt: new Date(),
                status,
            }).catch(err => console.error('[Email] Submission notification failed:', err.message));
        }
    } catch (error) {
        next(error);
    }
};

// PUT /api/assignments/:id/submit — Update submission
exports.updateSubmission = async (req, res, next) => {
    try {
        const { driveLink, comments } = req.body;

        if (!driveLink || !driveLink.trim()) {
            return res.status(400).json({ success: false, message: 'Google Drive link is required' });
        }

        if (!driveLink.includes('drive.google.com')) {
            return res.status(400).json({ success: false, message: 'Must be a valid Google Drive URL (drive.google.com)' });
        }

        const submission = await Submission.findOne({
            where: { assignmentId: req.params.id, studentId: req.student.id },
        });

        if (!submission) {
            return res.status(404).json({ success: false, message: 'No submission found to update' });
        }

        const assignment = await Assignment.findByPk(req.params.id);
        if (new Date() > new Date(assignment.deadline)) {
            return res.status(400).json({ success: false, message: 'Cannot edit submission after deadline' });
        }

        submission.driveLink = driveLink;
        submission.comments = comments || null;
        submission.submittedAt = new Date();
        await submission.save();

        res.status(200).json({
            success: true,
            message: 'Submission updated successfully!',
            submission,
        });
    } catch (error) {
        next(error);
    }
};
