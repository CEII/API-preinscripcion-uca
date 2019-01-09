const express = require('express');
const router = express.Router();

const sitioController = require('../controllers/registrar');
const cursoController = require('../controllers/cursos');


//router.get('/', sitioController.get_cupo);
/*
router.get('/', sitioController.check_cred, sitioController.get_cupo);
router.post('/registrar', sitioController.check_cred, sitioController.check_duplicate, sitioController.post_curso);
*/
router.get('/cursos', cursoController.get_all_cursos);
router.post('/cursos', cursoController.post_nuevo);
router.delete('/cursos/:idCurso', cursoController.delete_curso);
router.post('/cursos/reservar', cursoController.post_agregar_reserva);


module.exports = router;