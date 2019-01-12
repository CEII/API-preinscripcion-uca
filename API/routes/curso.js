const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursos');


//Cursos
router.get('/',  cursoController.get_all_cursos);
router.post('/', cursoController.post_nuevo);
router.delete('/:idCurso', cursoController.delete_curso);

module.exports = router;