const Material = require('../models/Material');

exports.getMaterialsByFilter = async (req, res) => {
    try {
        const { semester, regulation } = req.query;
        const materials = await Material.find({ semester, regulation });
        res.status(200).json({ success: true, materials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};