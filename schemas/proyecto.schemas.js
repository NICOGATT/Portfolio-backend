const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const createProyectoSchema = Joi.object({
    nombre: Joi.string().required(),
    descripcion: Joi.string().required(),
    urlRepo: Joi.string().uri().required(),
    img: Joi.array().items(Joi.string().uri()).optional().default([]), 
    usuarioId: objectId.required()
});

const updateProyectoSchema = Joi.object({
    nombre: Joi.string(),
    descripcion: Joi.string(),
    urlRepo: Joi.string().uri(),
    img: Joi.array().items(Joi.string().uri()).optional(),
    usuarioId: objectId
}).min(1).unknown(true);

const tecnologiasProyectoSchema = Joi.object({
    tecnologias: Joi.array().items(objectId.required()).min(1).required()
});

module.exports = {
    createProyectoSchema,
    updateProyectoSchema,
    tecnologiasProyectoSchema
}
