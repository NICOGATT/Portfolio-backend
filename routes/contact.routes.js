const {Router} = require('express');
const validarIdContact = require('../middleware/validarIdContact.middleware');
const verificarToken = require('../middleware/Auth.middleware');
const validarAdmin = require('../middleware/validarAdmin.middleware');
const { getContacts, getContactById, createContact, updateContact, deleteContact } = require('../controllers/contact.controller');
const validateContact = require('../middleware/validateContact.middleware');
const router = Router(); 


router.get('/contact', verificarToken, validarAdmin, getContacts); 
router.get('/contact/:id', verificarToken, validarAdmin,validarIdContact, getContactById);
router.post('/contact', validateContact, createContact); 
router.put('/contact/:id', verificarToken, validarAdmin, validarIdContact, updateContact); 
router.delete('/contact/:id', verificarToken, validarAdmin, validarIdContact, deleteContact);

module.exports = router