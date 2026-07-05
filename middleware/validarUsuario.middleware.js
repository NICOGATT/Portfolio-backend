const {createUsuarioSchema} = require('../schemas/usuario.schema');

const validarUsuario = (req, res, next) => {
    try{
        const {error} = createUsuarioSchema.validate(req.body);
        if(error) {
            return res.status(400).json({message: error.details[0].message});
        }
        next();
    }
    catch(error) {
        res.status(500).json({message: 'Error al validar el usuario'});
    }
}

module.exports = validarUsuario;