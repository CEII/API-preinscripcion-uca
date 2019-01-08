const express = require('express');
const router = express.Router();

const sitioController = require('../controllers/registrar');

//router.get('/', sitioController.get_cupo);
router.get('/', sitioController.check_cred, sitioController.get_cupo);
router.post('/registrar', sitioController.check_cred, sitioController.check_duplicate, sitioController.post_curso);
module.exports = router;