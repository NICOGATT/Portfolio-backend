const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const createUsuario = async (req, res) => {
    try {
        await Usuario.create(req.body);
        res.status(201).json({ message: 'Usuario creado con exito' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password -createdAt -updatedAt');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

const getUsuarioById = async (req, res) => {
    res.json(req.usuario);
};

const updateUsuario = async (req, res) => {
    try {
        const { nombre, email, password, numero, role } = req.body;
        const usuario = await Usuario.findByIdAndUpdate(
            req.usuario.id,
            { nombre, email, password, numero, role },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(usuario);
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.usuario.id);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        const jwtSecret = process.env.JWT_SECRET;
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

        if (!jwtSecret) {
            return res.status(500).json({
                message: 'JWT_SECRET no configurado'
            });
        }

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({
                message: 'Credenciales invalidas'
            });
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return res.status(401).json({
                message: 'Credenciales invalidas'
            });
        }

        const payload = {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role
        };

        const token = JWT.sign(payload, jwtSecret, {
            expiresIn: jwtExpiresIn
        });

        res.status(200).json({
            message: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                numero: usuario.numero,
                role: usuario.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    createUsuario,
    getUsuarios,
    getUsuarioById,
    updateUsuario,
    deleteUsuario,
    loginUsuario
};
