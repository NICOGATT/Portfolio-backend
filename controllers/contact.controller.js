const Contact = require('../models/contact');

const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newContact = await Contact.create({
            name,
            email,
            message
        });
        res.status(201).json({
            message: 'El contacto has sido enviado con exito',
            data: newContact
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al enviar mensaje',
            error: error.message
        });
    }
};

const getContacts = async (req, res) => {
    try {
        const contactos = await Contact.find().select('name email message createdAt');
        return res.status(200).json(contactos);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener contactos',
            error: error.message
        });
    }
};

const getContactById = async (req, res) => {
    return res.status(200).json(req.contacto);
};

const updateContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contacto = await Contact.findByIdAndUpdate(
            req.contacto.id,
            { name, email, message },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Contacto actualizado con exito',
            data: contacto
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el contacto',
            error: error.message
        });
    }
};

const deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.contacto.id);
        res.status(200).json({ message: 'Contacto eliminado' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el contacto',
            error: error.message
        });
    }
};

module.exports = {
    getContactById,
    getContacts,
    createContact,
    updateContact,
    deleteContact
};
