const { Router } = require('express');
const router = Router();
const proyectoController = require('../controllers/proyecto.controller');
const validarProyecto = require('../middleware/validarProyecto.middleware');
const validarIdProyecto = require('../middleware/validarIdProyecto.middleware');
const verificarToken = require('../middleware/Auth.middleware');
const validarAdmin = require('../middleware/validarAdmin.middleware');
const validarIdImagen = require('../middleware/validarIdImagen.middleware');
const validarTecnologiasProyecto = require('../middleware/validarTecnologiasProyecto.middleware');
const { upload } = require('../config/configMulter');

router.post('/proyectos', validarProyecto, proyectoController.crearProyecto);
router.get('/proyectos', proyectoController.getProyectos);
router.get('/proyectos/:id', validarIdProyecto, proyectoController.getProyectoById);
router.put('/proyectos/:id', verificarToken, validarAdmin, validarIdProyecto, validarProyecto, proyectoController.updateProyecto);
router.delete('/proyectos/:id', verificarToken, validarAdmin, validarIdProyecto, proyectoController.deleteProyecto);
router.post('/proyectos/:id/images', verificarToken, validarAdmin, validarIdProyecto, upload.array("images"), proyectoController.addImage);
router.get('/proyectos/:id/images', validarIdProyecto, proyectoController.getImageByProyecto); 
router.delete('/images/:id', verificarToken, validarAdmin, validarIdImagen, proyectoController.deleteImage ); 
// Agregar tecnologías a un proyecto
router.post(
    "/proyectos/:id/tecnologias",
    verificarToken, 
    validarAdmin,
    validarIdProyecto,
    validarTecnologiasProyecto,
    proyectoController.addTecnologiasProyecto
);

// Ver tecnologías de un proyecto
router.get(
    "/proyectos/:id/tecnologias",
    validarIdProyecto,
    proyectoController.getTecnologiasProyecto
);

// Reemplazar todas las tecnologías del proyecto
router.patch(
    "/proyectos/:id/tecnologias",
    verificarToken, 
    validarAdmin,
    validarIdProyecto,
    validarTecnologiasProyecto,
    proyectoController.setTecnologiasDeProyecto
);


module.exports = router;
