const createContactSchema = require('../schemas/contact.schema')

const validateContact = (req, res, next) => {
    try {
        const {error} = createContactSchema.validate(req.body); 
        if(error){
            return res.status(400).json({message : error.details[0].message});
        }
        next()
    } catch (error) {
        return res.status(500).json({
            message : "Error interno del servidor", 
            error: error.message
        })
    }
}

module.exports = validateContact
