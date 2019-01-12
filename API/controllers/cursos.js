const Curso = require('../models/curso');



exports.get_all_cursos = (req, res, next)=>{
    Curso.find({}).sort({nombre: 1})
    .exec()
    .then(docs =>{
        res.status(200).json({
            numeroCursos: docs.length,
            cursos: docs.map(doc=>{
                return {
                   _id: doc._id,
                   nombre: doc.nombre,
                   ponente: doc.ponente,
                   hora: doc.hora,
                   horario: doc.horario,
                   fechaEvento: doc.fechaEvento,
                   salon: doc.salon,
                   cupo: doc.cupo,
                   min: doc.min,
                   numeroInscritos: doc.inscritos.length
                }
            })
        });
    })
    .catch(err =>{
        res.status(500).json(err.message);
    });
};


exports.post_nuevo = (req,res,next)=>{
    const nuevoCurso = new Curso({
        nombre: req.body.nombre,
        ponente: req.body.ponente,
        hora: req.body.hora,
        horario: req.body.horario,
        fechaEvento: req.body.fechaEvento,
        salon: req.body.salon,
        cupo: req.body.cupo,
        min: req.body.min,
        descripcion: req.body.descripcion
    });
    nuevoCurso.save().then(resultado =>{
        res.status(201).json(resultado);
    })
    .catch(err => {
        res.status(500).json(err.message);
    });
};

exports.delete_curso = (req, res, next)=>{
    const id = req.params.idCurso;
    Curso.remove({_id: id}).exec().then(result => {
        res.status(200).json({message: "Curso borrado"});
    }).catch(err => {
        res.status(500).json(err);
    }); 
};

