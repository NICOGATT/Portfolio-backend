const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const verificarToken = require('../middleware/Auth.middleware');
const validarAdmin = require('../middleware/validarAdmin.middleware');

router.get('/overview', verificarToken, validarAdmin, analyticsController.getOverview);

module.exports = router;