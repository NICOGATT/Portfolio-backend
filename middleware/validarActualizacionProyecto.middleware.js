const { updateProyectoSchema } = require('../schemas/proyecto.schemas');

const validarActualizacionProyecto = (req, res, next) => {
    try {
        const { error } = updateProyectoSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error al validar el proyecto' });
    }
};

module.exports = validarActualizacionProyecto;
