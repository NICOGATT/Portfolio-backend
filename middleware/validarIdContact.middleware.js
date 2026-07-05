const mongoose = require('mongoose');
const Contact = require('../models/contact');

const validarIdContact = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de contacto invalido' });
        }

        const contacto = await Contact.findById(id);
        if (!contacto) {
            return res.status(404).json({
                message: 'Contacto no encontrado'
            });
        }

        req.contacto = contacto;
        next();
    } catch (error) {
        return res.status(500).json({
            error: 'Error al obtener el contacto',
            message: error.message
        });
    }
};

module.exports = validarIdContact;
