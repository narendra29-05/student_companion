const Drive = require('../models/Drive');
const Material = require('../models/Material');
const Todo = require('../models/Todo');

exports.getUnifiedDashboard = async (req, res) => {
    try {
        const studentId = req.student._id;
        const dept = req.student.department;

        const [drives, materials, todos] = await Promise.all([
            // 1. Only active drives eligible for the student's department
            Drive.find({ 
                isActive: true, 
                eligibleDepartments: dept,
                expiryDate: { $gt: new Date() } 
            }).sort({ expiryDate: 1 }).limit(4),

            // 2. Academic materials for student's department
            Material.find({ subject: { $regex: dept, $options: 'i' } }).limit(3),

            // 3. Personal To-Dos
            Todo.find({ student: studentId }).sort({ createdAt: -1 }).limit(5)
        ]);

        res.json({
            success: true,
            drives,
            materials,
            todos,
            attendance: "85%" // Placeholder logic
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error loading dashboard" });
    }
};