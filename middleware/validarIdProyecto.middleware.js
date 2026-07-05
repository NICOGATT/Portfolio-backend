const mongoose = require('mongoose');
const Proyecto = require('../models/proyecto');

const validarIdProyecto = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de proyecto invalido' });
        }

        const proyecto = await Proyecto.findById(id)
            .populate('images')
            .populate({ path: 'tecnologias', select: 'nombre icono' });

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        req.proyecto = proyecto;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error al validar el ID del proyecto', error: error.message });
    }
};

module.exports = validarIdProyecto;
