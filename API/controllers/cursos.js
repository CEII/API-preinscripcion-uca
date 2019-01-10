const Curso = require('../models/curso');

exports.post_nuevo = (req,res,next)=>{
    const nuevoCurso = new Curso({
        nombre: req.body.nombre,
        ponente: req.body.ponente,
        hora: req.body.hora,
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
        res.status(500).json(err);
    });
};

exports.get_reservas = (req, res, next) =>{
    idUsuario = req.userData.idUsuario;
    Curso.find({inscritos: idUsuario}).sort({name: 1})
    .exec()
    .then(docs =>{
        res.status(200).json({
            cuenta: docs.length,
            cursos: docs.map(doc=>{
                return {
                   _id: doc._id,
                   nombre: doc.nombre,
                   ponente: doc.ponente,
                   hora: doc.hora,
                   fechaEvento: doc.fechaEvento,
                   salon: doc.salon,
                   cupo: doc.cupo,
                   min: doc.min,
                   numeroInscritos: doc.inscritos.length,
                   inscritos: doc.inscritos
                }
            })
        });
    }).catch(err =>{
        res.status(500).json(err);
    });
};

exports.get_all_cursos = (req, res, next)=>{
    Curso.find({}).sort({nombre: 1})
    .exec()
    .then(docs =>{
        res.status(200).json({
            cuenta: docs.length,
            cursos: docs.map(doc=>{
                return {
                   _id: doc._id,
                   nombre: doc.nombre,
                   ponente: doc.ponente,
                   hora: doc.hora,
                   fechaEvento: doc.fechaEvento,
                   salon: doc.salon,
                   cupo: doc.cupo,
                   min: doc.min,
                   numeroInscritos: doc.inscritos.length,
                   inscritos: doc.inscritos
                }
            })
        });
    })
    .catch(err =>{
        res.status(500).json(err);
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

exports.post_agregar_reservas = (req, res, next)=>{
    idReservas = req.body.reservas;
    idUsuario = req.userData.idUsuario;
    const borrar = [];
    const agregar = [];
    Curso.find({inscritos: idUsuario})
    .select('_id')
    .exec()
    .then(docs =>{
        for(var i in docs){
            var flag=true;
            var j = 0;
            for(j in docs){
                if(docs[i]._id==idReservas[j]){
                    console.log(idReservas[j]);
                    flag=false;
                    break;
                }
            }
            if(flag){
                borrar.push(docs[i]._id);
            }
        }
        Curso.updateMany({_id: {$in: borrar}},{ $pull: { inscritos: idUsuario}},{ multi: true }).exec();
        return docs;
    }).then(chain =>{
        for(var i in idReservas){
            var flag=true;
            var j = 0;
            for(j in chain){
                if(idReservas[i]==chain[j]._id){
                    console.log(chain[j]._id);
                    flag=false;
                    break;
                }
            }
            if(flag){
                agregar.push(idReservas[i]);
            }
        }
        Curso.updateMany({_id: {$in: agregar}},{$addToSet: {inscritos:idUsuario}}).exec();
        res.status(200).json({message: "Inscrito!"});
    }).catch(err =>{
        res.status(500).json(err);
    });
};