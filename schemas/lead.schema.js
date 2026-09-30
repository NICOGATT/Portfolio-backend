const Joi = require('joi');
const { CANALES, ESTADOS } = require('../models/lead');

const registrarLeadSchema = Joi.object({
    canal: Joi.string().valid(...CANALES).required().messages({
        'any.only': `El canal debe ser uno de: ${CANALES.join(', ')}`,
        'any.required': 'El canal es obligatorio'
    }),

    identificador: Joi.string().trim().min(3).max(100).required().messages({
        'string.empty': 'El identificador esta vacio',
        'any.required': 'El identificador es obligatorio'
    }),

    nombre: Joi.string().trim().max(100).allow(''),
    telefono: Joi.string().trim().max(30).allow(''),

    email: Joi.string().trim().email().allow('').messages({
        'string.email': 'El email no es válido'
    }),

    mensaje: Joi.string().trim().max(2000).allow('').default(''),

    // Lo decide la IA en n8n: solo puede pasar el lead a "soporte", nunca sacarlo.
    pidioSoporte: Joi.boolean().default(false)
});

const actualizarLeadSchema = Joi.object({
    nombre: Joi.string().trim().max(100).allow(''),

    estado: Joi.string().valid(...ESTADOS).messages({
        'any.only': `El estado debe ser uno de: ${ESTADOS.join(', ')}`
    }),

    notas: Joi.string().trim().max(2000).allow('')
}).min(1).messages({
    'object.min': 'No hay datos para actualizar'
});

module.exports = {
    registrarLeadSchema,
    actualizarLeadSchema
};
