const Joi = require('joi');

const createTecnologiaSchema = Joi.object({
    nombre: Joi.string().required(), 
    icono: Joi.string().optional()
});

module.exports = createTecnologiaSchema;
