const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursos');
const checkLogin = require('../middleware/check-token');

//Cursos
router.get('/', cursoController.get_all_cursos);
router.post('/', cursoController.post_nuevo);
router.delete('/:idCurso', cursoController.delete_curso);

//Reservas
router.get('/', checkLogin, cursoController.get_reservas);
router.post('/reservar', checkLogin, cursoController.post_agregar_reservas);


module.exports = router;