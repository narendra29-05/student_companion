const { Op } = require('sequelize');
const { Drive, DriveEligibleDepartment } = require('../models/Drive');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const DriveApplication = require('../models/DriveApplication');
const { notifyNewDrive, notifyDriveUpdate, detectChanges } = require('../utils/emailService');

// @desc    Create new drive (Faculty only)
// @route   POST /api/drives
exports.createDrive = async (req, res, next) => {
    try {
        const { companyName, role, driveLink, description, eligibleDepartments, minCGPA, maxBacklogs, package: salary, expiryDate } = req.body;

        if (!companyName || !role || !driveLink || !expiryDate) {
            return res.status(400).json({ success: false, message: 'Company name, role, drive link, and expiry date are required' });
        }

        const drive = await Drive.create({
            companyName,
            role,
            driveLink,
            description,
            minCGPA,
            maxBacklogs: maxBacklogs || 0,
            package: salary,
            expiryDate,
            postedBy: req.faculty.id,
        });

        // Add eligible departments
        if (eligibleDepartments && eligibleDepartments.length > 0) {
            const deptRecords = eligibleDepartments.map((dept) => ({
                driveId: drive.id,
                department: dept,
            }));
            await DriveEligibleDepartment.bulkCreate(deptRecords);
        }

        const result = await Drive.findByPk(drive.id, {
            include: [{ model: DriveEligibleDepartment, as: 'eligibleDepartments' }],
        });

        res.status(201).json({
            success: true,
            message: 'Drive created successfully!',
            drive: result,
        });

        // Fire-and-forget email notification to eligible students
        const departments = eligibleDepartments && eligibleDepartments.length > 0
            ? eligibleDepartments : [];
        notifyNewDrive(drive, departments);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all drives (Faculty — only their own)
// @route   GET /api/drives/faculty
exports.getAllDrivesFaculty = async (req, res, next) => {
    try {
        const drives = await Drive.findAll({
            where: { postedBy: req.faculty.id },
            include: [{ model: DriveEligibleDepartment, as: 'eligibleDepartments' }],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({ success: true, count: drives.length, drives });
    } catch (error) {
        next(error);
    }
};

// @desc    Get active drives for students (filtered by student's department) with eligibility
// @route   GET /api/drives/student
exports.getActiveDrivesStudent = async (req, res, next) => {
    try {
        const student = await Student.findByPk(req.student.id);
        const studentDept = student.department;

        const drives = await Drive.findAll({
            where: {
                expiryDate: { [Op.gte]: new Date() },
                isActive: true,
            },
            include: [
                {
                    model: DriveEligibleDepartment,
                    as: 'eligibleDepartments',
                    where: { department: studentDept },
                    required: false,
                },
                {
                    model: Faculty,
                    as: 'faculty',
                    attributes: ['name', 'department'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        // Filter: show drives that have no dept restriction OR include student's dept
        const filtered = drives.filter((d) => {
            return d.eligibleDepartments.length === 0 ||
                d.eligibleDepartments.some((ed) => ed.department === studentDept);
        });

        // Fetch student's applications
        const applications = await DriveApplication.findAll({
            where: { studentId: student.id },
        });
        const appMap = {};
        applications.forEach((app) => {
            appMap[app.driveId] = app.status;
        });

        // Enrich drives with eligibility and application status
        const enriched = filtered.map((d) => {
            const drive = d.toJSON();
            const eligibilityReasons = [];

            if (student.cgpa !== null && drive.minCGPA && student.cgpa < drive.minCGPA) {
                eligibilityReasons.push(`CGPA ${student.cgpa} is below minimum ${drive.minCGPA}`);
            }
            if (student.backlogs > (drive.maxBacklogs || 0)) {
                eligibilityReasons.push(`${student.backlogs} backlogs exceeds max allowed ${drive.maxBacklogs || 0}`);
            }

            drive.isEligible = eligibilityReasons.length === 0;
            drive.eligibilityReasons = eligibilityReasons;
            drive.applicationStatus = appMap[drive.id] || null;
            return drive;
        });

        res.status(200).json({ success: true, count: enriched.length, drives: enriched });
    } catch (error) {
        next(error);
    }
};

// @desc    Apply to a drive
// @route   POST /api/drives/apply/:driveId
exports.applyToDrive = async (req, res, next) => {
    try {
        const student = await Student.findByPk(req.student.id);
        const drive = await Drive.findByPk(req.params.driveId);

        if (!drive) {
            return res.status(404).json({ success: false, message: 'Drive not found' });
        }

        if (!student.profileCompleted) {
            return res.status(400).json({ success: false, message: 'Please complete your profile before applying' });
        }

        // Check eligibility
        const reasons = [];
        if (student.cgpa !== null && drive.minCGPA && student.cgpa < drive.minCGPA) {
            reasons.push(`CGPA ${student.cgpa} is below minimum ${drive.minCGPA}`);
        }
        if (student.backlogs > (drive.maxBacklogs || 0)) {
            reasons.push(`${student.backlogs} backlogs exceeds max allowed ${drive.maxBacklogs || 0}`);
        }
        if (reasons.length > 0) {
            return res.status(400).json({ success: false, message: 'Not eligible', reasons });
        }

        // Create or update application
        const [application, created] = await DriveApplication.findOrCreate({
            where: { studentId: student.id, driveId: drive.id },
            defaults: { status: 'interested' },
        });

        res.status(created ? 201 : 200).json({
            success: true,
            message: created ? 'Application recorded' : 'Already applied',
            application,
            studentProfile: {
                name: student.firstName && student.lastName
                    ? `${student.firstName} ${student.lastName}`
                    : student.name,
                rollNumber: student.rollNumber,
                email: student.collegeEmail,
                department: student.department,
                year: student.year,
                cgpa: student.cgpa,
                backlogs: student.backlogs,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PATCH /api/drives/apply/:driveId
exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['interested', 'applied'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const application = await DriveApplication.findOne({
            where: { studentId: req.student.id, driveId: req.params.driveId },
        });

        if (!application) {
            // Create application if it doesn't exist
            const newApp = await DriveApplication.create({
                studentId: req.student.id,
                driveId: req.params.driveId,
                status,
            });
            return res.status(201).json({ success: true, application: newApp });
        }

        await application.update({ status });

        res.status(200).json({ success: true, application });
    } catch (error) {
        next(error);
    }
};

// @desc    Update drive
// @route   PUT /api/drives/:id
exports.updateDrive = async (req, res, next) => {
    try {
        const drive = await Drive.findByPk(req.params.id);

        if (!drive) {
            return res.status(404).json({ success: false, message: 'Drive not found' });
        }

        if (drive.postedBy !== req.faculty.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this drive' });
        }

        const { companyName, role, driveLink, description, eligibleDepartments, minCGPA, maxBacklogs, package: salary, expiryDate, isActive } = req.body;

        // Snapshot old values before updating
        const oldValues = {
            companyName: drive.companyName,
            role: drive.role,
            driveLink: drive.driveLink,
            description: drive.description,
            minCGPA: drive.minCGPA,
            package: drive.package,
            expiryDate: drive.expiryDate,
            isActive: drive.isActive,
        };

        await drive.update({
            companyName: companyName || drive.companyName,
            role: role || drive.role,
            driveLink: driveLink || drive.driveLink,
            description: description !== undefined ? description : drive.description,
            minCGPA: minCGPA !== undefined ? minCGPA : drive.minCGPA,
            maxBacklogs: maxBacklogs !== undefined ? maxBacklogs : drive.maxBacklogs,
            package: salary !== undefined ? salary : drive.package,
            expiryDate: expiryDate || drive.expiryDate,
            isActive: isActive !== undefined ? isActive : drive.isActive,
        });

        // Update eligible departments if provided
        if (eligibleDepartments) {
            await DriveEligibleDepartment.destroy({ where: { driveId: drive.id } });
            if (eligibleDepartments.length > 0) {
                const deptRecords = eligibleDepartments.map((dept) => ({
                    driveId: drive.id,
                    department: dept,
                }));
                await DriveEligibleDepartment.bulkCreate(deptRecords);
            }
        }

        const result = await Drive.findByPk(drive.id, {
            include: [{ model: DriveEligibleDepartment, as: 'eligibleDepartments' }],
        });

        res.status(200).json({
            success: true,
            message: 'Drive updated successfully!',
            drive: result,
        });

        // Fire-and-forget: detect what changed and notify students
        const changes = detectChanges(oldValues, drive.toJSON());
        const currentDepts = result.eligibleDepartments.map((ed) => ed.department);
        notifyDriveUpdate(drive, currentDepts, changes);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete drive
// @route   DELETE /api/drives/:id
exports.deleteDrive = async (req, res, next) => {
    try {
        const drive = await Drive.findByPk(req.params.id);

        if (!drive) {
            return res.status(404).json({ success: false, message: 'Drive not found' });
        }

        if (drive.postedBy !== req.faculty.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this drive' });
        }

        await drive.destroy();

        res.status(200).json({ success: true, message: 'Drive deleted successfully!' });
    } catch (error) {
        next(error);
    }
};
