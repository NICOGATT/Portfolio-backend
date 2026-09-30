const mongoose = require('mongoose');
const Lead = require('../models/lead');

const validarIdLead = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de lead invalido' });
        }

        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({ message: 'Lead no encontrado' });
        }

        req.lead = lead;
        next();
    } catch (error) {
        return res.status(500).json({
            error: 'Error al obtener el lead',
            message: error.message
        });
    }
};

module.exports = validarIdLead;
