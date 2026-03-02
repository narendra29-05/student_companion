const { Op } = require('sequelize');
const { Drive, DriveEligibleDepartment } = require('../models/Drive');
const Todo = require('../models/Todo');
const { Material, MaterialUnit } = require('../models/Material');

exports.getUnifiedDashboard = async (req, res, next) => {
    try {
        const studentId = req.student.id;
        const dept = req.student.department;

        const [drives, todos, materials] = await Promise.all([
            Drive.findAll({
                where: {
                    isActive: true,
                    expiryDate: { [Op.gt]: new Date() },
                },
                include: [{
                    model: DriveEligibleDepartment,
                    as: 'eligibleDepartments',
                }],
                order: [['expiryDate', 'ASC']],
                limit: 5,
            }).then((results) =>
                results.filter((d) =>
                    d.eligibleDepartments.length === 0 ||
                    d.eligibleDepartments.some((ed) => ed.department === dept)
                )
            ),

            Todo.findAll({
                where: { studentId },
                order: [['createdAt', 'DESC']],
                limit: 5,
            }),

            Material.findAll({
                where: { department: dept },
                include: [{ model: MaterialUnit, as: 'units' }],
                limit: 3,
            }),
        ]);

        res.json({
            success: true,
            data: { drives, todos, materials },
        });
    } catch (error) {
        next(error);
    }
};
