const createProyectoTecnologiaSchema = require('../schemas/proyectoTecnologia.schemas')

const validarProyectoTecnologia = (req, res, next) => {
    try {
        const {error} = createProyectoTecnologiaSchema.validate(req.body)
        if(error) {
            return res.status(400).json({message : error.details[0].message})
        }
        next()
    } catch (error) {
        return res.status(500).json({message : "Error al validar el proyectoTecnologia"})
    }
}

module.exports = validarProyectoTecnologia;
