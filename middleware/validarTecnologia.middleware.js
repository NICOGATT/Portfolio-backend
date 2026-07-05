const createTecnologiaSchema = require('../schemas/tecnologia.schemas')

const validarTecnologia = (req, res, next) => {
    try {
        const {error} = createTecnologiaSchema.validate(req.body); 
        if(error) {
            return res.status(400).json({message : error.details[0].message})
        }
        if(!req.body.icono && !req.file) {
            return res.status(400).json({message : "El icono es obligatorio"})
        }
        next()
    } catch (error) {
        return res.status(500).json({message : "Error al validar el usuario"})
    }
}

module.exports = validarTecnologia; 
