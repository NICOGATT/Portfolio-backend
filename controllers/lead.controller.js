const Lead = require('../models/lead');
const { CANALES, ESTADOS } = require('../models/lead');

// Crea el lead la primera vez que escribe y lo actualiza en los mensajes siguientes.
const registrarLead = async (req, res) => {
    try {
        const { canal, identificador, nombre, telefono, email, mensaje, pidioSoporte } = req.body;

        const cambios = { ultimoMensaje: mensaje, ultimoContacto: new Date() };
        if (nombre) cambios.nombre = nombre;
        if (telefono) cambios.telefono = telefono;
        if (email) cambios.email = email;
        if (pidioSoporte) cambios.estado = 'soporte';

        const lead = await Lead.findOneAndUpdate(
            { canal, identificador },
            { $set: cambios, $inc: { cantidadMensajes: 1 } },
            { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            message: 'Lead registrado con exito',
            data: lead
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al registrar el lead',
            error: error.message
        });
    }
};

const getLeads = async (req, res) => {
    try {
        const { estado, canal } = req.query;
        const filtro = {};
        if (ESTADOS.includes(estado)) filtro.estado = estado;
        if (CANALES.includes(canal)) filtro.canal = canal;

        const leads = await Lead.find(filtro).sort({ ultimoContacto: -1 });
        return res.status(200).json(leads);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener leads',
            error: error.message
        });
    }
};

const updateLead = async (req, res) => {
    try {
        const { nombre, estado, notas } = req.body;
        const lead = await Lead.findByIdAndUpdate(
            req.lead.id,
            { nombre, estado, notas },
            { returnDocument: 'after', runValidators: true }
        );

        res.status(200).json({
            message: 'Lead actualizado con exito',
            data: lead
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar el lead',
            error: error.message
        });
    }
};

const deleteLead = async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.lead.id);
        res.status(200).json({ message: 'Lead eliminado' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar el lead',
            error: error.message
        });
    }
};

module.exports = {
    registrarLead,
    getLeads,
    updateLead,
    deleteLead
};
