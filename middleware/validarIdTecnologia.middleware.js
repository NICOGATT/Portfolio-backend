const mongoose = require('mongoose');
const Tecnologia = require('../models/tecnologia');

const validarIdTecnologia = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de tecnologia invalido' });
        }

        const tecnologia = await Tecnologia.findById(id);
        if (!tecnologia) {
            return res.status(404).json({ message: 'La tecnologia no fue encontrada' });
        }

        req.tecnologia = tecnologia;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = validarIdTecnologia;
