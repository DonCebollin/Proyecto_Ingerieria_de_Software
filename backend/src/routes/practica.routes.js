const express=require('express');
const router=express.Router();
const practicaController=require('../controllers/practica.controller');
const {authenticateToken}=require('../middlewares/authentication.middleware');
const {isStudent, isEncargadoPracticas}=require('../middlewares/authentication.middleware');
const {validarCreacionPractica}=require('../validations/practica.validation');

//rutas para estudiante
router.post('/crear',authenticateToken,isStudent,validarCreacionPractica,practicaController.crearPractica);

router.get('/mis-practicas',authenticateToken,isStudent,practicaController.obtenerPracticasEstudiante);

router.put('/actualizar/:id',authenticateToken,isEncargadoPracticas,practicaController.actualizarPractica);

//rutas para el encargado de practica
router.get('/todas',authenticateToken,isEncargadoPracticas,practicaController.obtenerTodasPracticas);

router.put('estado/:id',authenticateToken,isEncargadoPracticas,practicaController.actualizarEstadoPractica);

//rutas compartidas
router.get('/:id',authenticateToken,practicaController.obtenerPracticaPorId);

module.exports=router;