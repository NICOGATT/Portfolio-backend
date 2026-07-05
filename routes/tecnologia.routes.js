const {Router} = require('express'); 
const { getTecnologia, crearTecnologia, updateTecnologia, deleteTecnologia, getTecnolgiaId } = require('../controllers/tecnologia.controller');
const validarIdTecnologia = require('../middleware/validarIdTecnologia.middleware');
const verificarToken = require('../middleware/Auth.middleware');
const validarAdmin = require('../middleware/validarAdmin.middleware');
const validarTecnologia = require('../middleware/validarTecnologia.middleware');
const { upload } = require('../config/configMulter');
const router = Router(); 


router.get('/tecnologias', getTecnologia); 
router.post('/tecnologia', verificarToken, validarAdmin, upload.single('icono'), validarTecnologia, crearTecnologia); 
router.patch('/tecnologia/:id', verificarToken, validarAdmin, validarIdTecnologia, upload.single('icono'), validarTecnologia, updateTecnologia); 
router.delete('/tecnologia/:id', verificarToken, validarAdmin, validarIdTecnologia, deleteTecnologia); 
router.get('/tecnologia/:id', validarIdTecnologia, getTecnolgiaId);

module.exports = router
