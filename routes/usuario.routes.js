const {Router} = require('express');
const router = Router();
const usuarioController = require('../controllers/usuario.controller');
const validarId = require('../middleware/validarId.middleware');
const validarUsuario = require('../middleware/validarUsuario.middleware');
const hashPassword = require('../middleware/hashPassword.middleware');
const verificarToken = require('../middleware/Auth.middleware');
const validarAdmin = require('../middleware/validarAdmin.middleware');

router.post('/usuarios', validarUsuario, hashPassword, usuarioController.createUsuario);
router.post('/auth/login', usuarioController.loginUsuario);
router.get('/usuarios'  , usuarioController.getUsuarios);
router.get('/usuarios/:id', verificarToken,validarId, usuarioController.getUsuarioById);
router.put('/usuarios/:id', validarId, validarUsuario, hashPassword, usuarioController.updateUsuario);
router.delete('/usuarios/:id', validarId, usuarioController.deleteUsuario);

module.exports = router;