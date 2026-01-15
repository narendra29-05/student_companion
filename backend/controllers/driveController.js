const Drive = require('../models/Drive');

// @desc    Create new drive (Faculty only)
// @route   POST /api/drives
exports.createDrive = async (req, res) => {
    try {
        const { companyName, role, driveLink, description, eligibleDepartments, minCGPA, package: salary, expiryDate } = req.body;

        const drive = await Drive.create({
            companyName,
            role,
            driveLink,
            description,
            eligibleDepartments,
            minCGPA,
            package: salary,
            expiryDate,
            postedBy: req.faculty._id
        });

        res.status(201).json({
            success: true,
            message: 'Drive created successfully!',
            drive
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all drives (Faculty)
// @route   GET /api/drives/faculty
exports.getAllDrivesFaculty = async (req, res) => {
    try {
        const drives = await Drive.find({ postedBy: req.faculty._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: drives.length,
            drives
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get active drives for students (non-expired only)
// @route   GET /api/drives/student
exports.getActiveDrivesStudent = async (req, res) => {
    try {
        const currentDate = new Date();
        
        const drives = await Drive.find({
            expiryDate: { $gte: currentDate },
            isActive: true
        })
        .populate('postedBy', 'name department')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: drives.length,
            drives
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update drive
// @route   PUT /api/drives/:id
exports.updateDrive = async (req, res) => {
    try {
        let drive = await Drive.findById(req.params.id);

        if (!drive) {
            return res.status(404).json({ success: false, message: 'Drive not found' });
        }

        // Make sure faculty owns the drive
        if (drive.postedBy.toString() !== req.faculty._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this drive' });
        }

        drive = await Drive.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Drive updated successfully!',
            drive
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete drive
// @route   DELETE /api/drives/:id
exports.deleteDrive = async (req, res) => {
    try {
        const drive = await Drive.findById(req.params.id);

        if (!drive) {
            return res.status(404).json({ success: false, message: 'Drive not found' });
        }

        if (drive.postedBy.toString() !== req.faculty._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this drive' });
        }

        await drive.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Drive deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
