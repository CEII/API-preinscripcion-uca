const Curso = require('../models/curso');

exports.get_all_cursos = (req, res, next)=>{
    Curso.find({}).sort({horario: -1, numeroDia: 1})
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
                   numeroDia: doc.numeroDia,
                   fechaEvento: doc.fechaEvento,
                   salon: doc.salon,
                   cupo: doc.cupo,
                   min: doc.min,
                   numeroInscritos: doc.inscritos.length,
                   descripcion: doc.descripcion
                }
            })
        });
    })
    .catch(err =>{
        res.status(500).json(err.message);
    });
};

exports.get_curso = (req, res, next)=>{
    idCurso = req.params.idCurso;
    Curso.findById(idCurso)
    .exec()
    .then(doc =>{
        if(doc){
            res.status(200).json({
                _id: doc._id,
                nombre: doc.nombre,
                ponente: doc.ponente,
                hora: doc.hora,
                horario: doc.horario,
                numeroDia: doc.numeroDia,
                fechaEvento: doc.fechaEvento,
                salon: doc.salon,
                cupo: doc.cupo,
                min: doc.min,
                numeroInscritos: doc.inscritos.length,
                inscritos: doc.inscritos,
                descripcion: doc.descripcion
            });
        }
        else{
            res.status(404).json({message: "No existe dicho curso"})
        }
    })
    .catch(err =>{
        res.status(500).json(err.message);
    });
};


exports.get_horario_cursos = (req, res ,next)=>{
    horarioUsuario = req.userData.horario;
    Curso.find({horario: {$ne:horarioUsuario}})
    .sort({numeroDia: 1})
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
                   numeroDia: doc.numeroDia,
                   fechaEvento: doc.fechaEvento,
                   salon: doc.salon,
                   cupo: doc.cupo,
                   min: doc.min,
                   numeroInscritos: doc.inscritos.length,
                   descripcion: doc.descripcion
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
        numeroDia: req.body.numeroDia,
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
    const idCurso = req.params.idCurso;
    const promises = [];
    Curso.findById(idCurso).exec()
    .then(cursoDoc =>{
        if(cursoDoc){
            promises.push(Estudiante.updateMany({_id : {$in: cursoDoc.inscritos}}, 
                {$pull: {cursosInscritos: idCurso, cursosAsistidos: idCurso }},{ multi: true }).exec());
            promises.push(Curso.remove({_id: idCurso}).exec());
            Promise.all(promises).then(resultadoPromesas=>{
                res.status(200).json({message:"Curso borrado"});
            })
            .catch(err=>{
                res.status(500).json(err.message);
            });
        }
        else{
            res.status(404).json({message: "Curso no encontrado"});
        }
    });
};

exports.delete_limpiar_inscritos = (req, res, next)=>{
    const id = req.params.idCurso;
    Curso.updateOne({_id: id},{$set: { inscritos: []}}).exec().then(result => {
        res.status(200).json({message: "Inscritos removidos"});
    }).catch(err => {
        res.status(500).json(err);
    }); 
};

exports.patch_curso = (req,res,next)=>{
    const idCurso = req.params.idCurso;
    const cursoCampos = {};
    for(const opcion of req.body){
        cursoCampos[opcion.campoActualizar] = opcion.valor;
    }
    if(cursoCampos.inscritos || cursoCampos.asistieron){
        res.status(304).json({message: "Por cuestiones de seguridad no se pueden modificiar --> inscritos, asistieron"});
    }
    else{
        Curso.updateOne({_id: idCurso}, { $set : cursoCampos })
        .exec()
        .then(resultado => {
            res.status(200).json({message: "Curso actualizado"});
        })
        .catch(err => {
            errorChecker(res,err);
        });
    }
};


