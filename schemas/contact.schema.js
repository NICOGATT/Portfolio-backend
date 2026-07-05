const Joi = require('joi'); 

const createContactSchema = Joi.object({
    name : Joi.string().min(3).required().messages({
        "string.base" : "El nombre es obligatorio",
        "string.empty" : "El nombre esta vacio", 
        "any.required" : "El nombre es obligatorio"
    }), 

    email : Joi.string().email().required().messages({
        'string.email': 'El email no es válido', 
        "string.empty" : "El email debe ser obligatorio", 
        "any.required" : "El email es obligatorio"
    }), 

    message: Joi.string().min(3).max(100).required().messages({
        "string.base" : "El mensaje es obligatorio",
        "string.empty" : "El mensaje esta vacio", 
        "any.required" : "El mensaje es obligatorio"
    })
})

module.exports = createContactSchema
