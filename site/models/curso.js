const mongoose = require('mongoose');

var cursoSchema = mongoose.Schema({
    nombre: {type: String, require:true},
    ponente: {type: String, require:true},
    hora: {type: String, require:true},
    salon: {type: String, require:true},
    fechaEvento: {type: String, require: true},
    min: {type: Number,  require:true},
    cupo: { type: Number,  require:true},
    descripcion: {type: String, require: true},
    inscritos: [{ type: String}],
    asistieron: [{ type: String}]
});

module.exports = mongoose.model('Curso', cursoSchema);