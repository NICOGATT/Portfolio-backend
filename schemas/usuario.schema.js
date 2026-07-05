const Joi = require('joi');

const createUsuarioSchema = Joi.object({
    nombre: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    numero: Joi.string().required(),
    role: Joi.string().valid('user', 'admin').optional()
});

module.exports = {
    createUsuarioSchema
}
