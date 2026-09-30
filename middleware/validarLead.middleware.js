const { registrarLeadSchema, actualizarLeadSchema } = require('../schemas/lead.schema');

const validarCon = (schema) => (req, res, next) => {
    try {
        const { error, value } = schema.validate(req.body, { stripUnknown: true });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        req.body = value;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error al validar el lead' });
    }
};

module.exports = {
    validarRegistroLead: validarCon(registrarLeadSchema),
    validarActualizacionLead: validarCon(actualizarLeadSchema)
};
