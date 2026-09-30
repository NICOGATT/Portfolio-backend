const { Router } = require('express');
const verificarToken = require('../middleware/Auth.middleware');
const validarAdmin = require('../middleware/validarAdmin.middleware');
const validarApiKeyN8n = require('../middleware/validarApiKeyN8n.middleware');
const validarIdLead = require('../middleware/validarIdLead.middleware');
const { validarRegistroLead, validarActualizacionLead } = require('../middleware/validarLead.middleware');
const { registrarLead, getLeads, updateLead, deleteLead } = require('../controllers/lead.controller');
const router = Router();

// La llama n8n cada vez que entra un mensaje (WhatsApp, Instagram, etc.).
router.post('/leads/registrar', validarApiKeyN8n, validarRegistroLead, registrarLead);

router.get('/leads', verificarToken, validarAdmin, getLeads);
router.patch('/leads/:id', verificarToken, validarAdmin, validarIdLead, validarActualizacionLead, updateLead);
router.delete('/leads/:id', verificarToken, validarAdmin, validarIdLead, deleteLead);

module.exports = router;
