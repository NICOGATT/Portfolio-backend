const bcrypt = require('bcrypt');

const hashPassword = async (req, res, next) => {
    try {
        if(!req.body.password) {
            return res.status(400).json({message: 'La contraseña es requerida'});
        }
        const saltRounds = 10; 
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        next();
    } catch (error) {
        res.status(500).json({message: 'Error al encriptar la contraseña'});
    }
}

module.exports = hashPassword;