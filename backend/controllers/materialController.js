const { Material, MaterialUnit } = require('../models/Material');

exports.getMaterialsByFilter = async (req, res, next) => {
    try {
        const { semester, regulation } = req.query;

        const where = {};
        if (semester) where.semester = semester;
        if (regulation) where.regulation = regulation;

        const materials = await Material.findAll({
            where,
            include: [{ model: MaterialUnit, as: 'units' }],
            order: [
                ['semester', 'ASC'],
                ['subject', 'ASC'],
                [{ model: MaterialUnit, as: 'units' }, 'id', 'ASC'],
            ],
        });

        res.status(200).json({ success: true, materials });
    } catch (error) {
        next(error);
    }
};
