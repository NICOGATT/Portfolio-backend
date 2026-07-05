const { tecnologiasProyectoSchema } = require('../schemas/proyecto.schemas');

const validarTecnologiasProyecto = (req, res, next) => {
    try {
        const { error } = tecnologiasProyectoSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        next();
    } catch (error) {
        res.status(500).json({
            message: 'Error al validar tecnologias del proyecto',
            error: error.message
        });
    }
};

module.exports = validarTecnologiasProyecto;
