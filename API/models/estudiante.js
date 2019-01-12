const mongoose = require('mongoose');

var cursoSchema = mongoose.Schema({
    carnet: {type: String, require: true},
    secreto: {type: String, require: true},
    nombre: {type: String, require: true},
    apellido: {type: String, require:true},
    horario: {type: String, require: true},
    cursosInscritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso'}],
    cursosAsistidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso'}]
});

module.exports = mongoose.model('Estudiante', cursoSchema);