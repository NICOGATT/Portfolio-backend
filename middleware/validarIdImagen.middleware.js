const mongoose = require('mongoose');
const ProjectImage = require('../models/projectimage');

const validarIdImagen = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de imagen invalido' });
        }

        const image = await ProjectImage.findById(id);
        if (!image) {
            return res.status(404).json({
                message: 'Imagen no encontrada'
            });
        }

        req.image = image;
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Error al validar id de la imagen',
            error: error.message
        });
    }
};

module.exports = validarIdImagen;
