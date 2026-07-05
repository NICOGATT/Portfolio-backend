const JWT = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const verificarToken = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({ message: 'JWT_SECRET no configurado' });
    }

    if (!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Formato de token invalido' });
    }

    try {
        const decoded = JWT.verify(token, jwtSecret);
        const usuario = await Usuario.findById(decoded.id).select('-password');

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }

        return res.status(401).json({ message: 'Token no valido' });
    }
};

module.exports = verificarToken;
