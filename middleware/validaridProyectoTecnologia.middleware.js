const mongoose = require('mongoose');
const Proyecto = require('../models/proyecto');
const Tecnologia = require('../models/tecnologia');

const validarIdProyectoTecnologia = async (req, res, next) => {
    try {
        const { proyectoId, tecnologiaId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(proyectoId) || !mongoose.Types.ObjectId.isValid(tecnologiaId)) {
            return res.status(400).json({ message: 'IDs invalidos' });
        }

        const proyecto = await Proyecto.findById(proyectoId);
        const tecnologia = await Tecnologia.findById(tecnologiaId);

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        if (!tecnologia) {
            return res.status(404).json({ message: 'Tecnologia no encontrada' });
        }

        req.proyecto = proyecto;
        req.tecnologia = tecnologia;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error al validar IDs', error: error.message });
    }
};

module.exports = validarIdProyectoTecnologia;
