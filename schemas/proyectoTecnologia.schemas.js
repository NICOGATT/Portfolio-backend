const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const createProyectoTecnologiaSchema = Joi.object({
    proyectoId: objectId.required(),
    tecnologiaId: objectId.required()
});

module.exports = createProyectoTecnologiaSchema;
