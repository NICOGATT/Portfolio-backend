const mongoose = require('mongoose');
const Tecnologia = require('../models/tecnologia');

const validarIdTecnologiaProyecto = async (req, res, next) => {
    try {
        const { tecnologiaId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(tecnologiaId)) {
            return res.status(400).json({ message: 'ID de tecnologia invalido' });
        }

        const tecnologia = await Tecnologia.findById(tecnologiaId);
        if (!tecnologia) {
            return res.status(404).json({ message: 'La tecnologia no fue encontrada' });
        }

        req.tecnologia = tecnologia;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = validarIdTecnologiaProyecto;
