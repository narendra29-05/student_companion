const Drive = require('../models/Drive');
const Todo = require('../models/Todo');
const Material = require('../models/Material');

exports.getUnifiedDashboard = async (req, res) => {
    try {
        // req.student._id and req.student.department come from your authMiddleware
        const studentId = req.student._id;
        const dept = req.student.department;

        const [drives, todos, materials] = await Promise.all([
            // 1. Fetch Active Drives matching student's department
            Drive.find({ 
                isActive: true, 
                eligibleDepartments: dept,
                expiryDate: { $gt: new Date() } 
            }).sort({ expiryDate: 1 }).limit(5),

            // 2. Fetch Personal Todos for the logged-in student
            Todo.find({ student: studentId }).sort({ createdAt: -1 }).limit(5),

            // 3. Fetch Academic Materials for the department
            Material.find({ subject: { $regex: dept, $options: 'i' } }).limit(3)
        ]);

        res.json({
            success: true,
            data: {
                drives,
                todos,
                materials,
                attendance: "85%" // Dynamic calculation can be added here later
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error loading dashboard data" });
    }
};