const {createProyectoSchema} = require('../schemas/proyecto.schemas');
const validarProyecto = (req, res, next) => {
    try{
        const {error} = createProyectoSchema.validate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message});
        }
        next();
    } catch(error) {
        res.status(500).json({message: 'Error al validar el proyecto'});
    }
}

module.exports = validarProyecto;