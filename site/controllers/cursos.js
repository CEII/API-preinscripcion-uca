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
                   numeroInscritos: doc.length,
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

exports.post_agregar_reserva = (req, res, next)=>{
    idReservas = req.body.reservas;
    bodyCarnet = req.body.carnet;
    Curso.find({inscritos: bodyCarnet}).exec()
    .then(docs =>{
        const borrar = [];
        const agregar = [];
        for(var i in idReservas){
            var flag=true;
            var j = 0;
            for(j in docs){
                if(idReservas[i]==docs[j]._id){
                    console.log(docs[j]._id);
                    flag=false;
                    break;
                }
            }
            if(flag){
                agregar.push(idReservas[i]);
            }
        }
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
        console.log(idReservas);
        console.log('**********');
        console.log(docs);
        console.log('**********');
        console.log(agregar);
        console.log('**********');
        console.log(borrar);
        
        Curso.update(
            {_id: {$in: agregar}},
            {$addToSet: {inscritos:bodyCarnet}})
        .exec()
        .then()
        .catch(err =>{
            return res.status(500).json(err);
        });
        Curso.update(
        {_id: {$in: borrar}},
        { $pull: { inscritos: bodyCarnet}},{ multi: true }).exec()
        .then(updated =>{
            res.status(200).json({message: "Curso chidori"});
        })
        .catch(err =>{
            return res.status(500).json(err);
        });
    }).catch(err =>{
        res.status(500).json(err);
    });
};