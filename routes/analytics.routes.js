const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const verificarToken = require('../middleware/Auth.middleware');
const validarAdmin = require('../middleware/validarAdmin.middleware');

router.get('/overview', verificarToken, validarAdmin, analyticsController.getOverview);
router.get('/visits', verificarToken, validarAdmin, analyticsController.getVisits)

module.exports = router;