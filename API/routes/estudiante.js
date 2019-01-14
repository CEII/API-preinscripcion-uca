const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudiantes');
const checkLogin = require('../middleware/check-token');


router.get('/', estudianteController.get_all_estudiantes);
router.get('/personal', checkLogin, estudianteController.get_personal_cursos);
router.post('/', estudianteController.post_new_estudiantes);
router.post('/login', estudianteController.post_new_login);
router.delete('/:idEstudiante', estudianteController.delete_estudiante);
router.post('/reservar/:idCurso', checkLogin, estudianteController.post_verificar_reserva);
router.patch('/:idEstudiante', cursoController.patch_estudiante);
module.exports = router;