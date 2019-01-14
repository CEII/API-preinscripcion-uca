const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursos');
const checkLogin = require('../middleware/check-token');


//Cursos
router.get('/todos',  cursoController.get_all_cursos);
router.get('/:idCurso', cursoController.get_curso);
router.get('/' , checkLogin, cursoController.get_horario_cursos);
router.post('/', cursoController.post_nuevo);
router.delete('/:idCurso', cursoController.delete_curso);

module.exports = router;