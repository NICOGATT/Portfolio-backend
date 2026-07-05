const mongoose = require('mongoose');
const Usuario = require('../models/usuario');

const validarId = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de usuario invalido' });
        }

        const usuario = await Usuario.findById(id).select('-password');
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error al validar el ID', error: error.message });
    }
};

module.exports = validarId;
