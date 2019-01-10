const mongoose = require('mongoose');

var cursoSchema = mongoose.Schema({
    carnet: {type: String, require: true},
    secreto: {type: String, require: true},
    nombre: {type: String},
    apellido: {type: String},
});

module.exports = mongoose.model('Estudiante', cursoSchema);