const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudiantes');


router.get('/', estudianteController.get_all_estudiantes);
router.post('/', estudianteController.post_new_estudiantes);
router.post('/login', estudianteController.post_new_login);


module.exports = router;