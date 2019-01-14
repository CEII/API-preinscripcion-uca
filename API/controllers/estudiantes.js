const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.get_all_estudiantes = (req, res, next)=>{
    Estudiante.find({}).sort({carnet: 1})
    .select('_id carnet nombre apellido horario cursosInscritos cursosAsistidos')
    .exec()
    .then(docs =>{
        res.status(200).json({
            registrados: docs.length,
            usuarios: docs.map(doc =>{
                return {
                    _id: doc._id,
                    carnet: doc.carnet,
                    nombre: doc.nombre,
                    apellido: doc.apellido,
                    horario: doc.horario,
                    cursosInscritos: doc.cursosInscritos.length,
                    cursosAsistidos: doc.cursosAsistidos.length
                }
            })
        });
    }).catch(err => {
        res.status(500).json(err.message);
    });
};

exports.get_personal_cursos = (req, res, next)=>{
    idUsuario = req.userData.idUsuario;
    Estudiante.findById(idUsuario)
    .select('cursosInscritos cursosAsistidos')
    .exec()
    .then(resultado =>{
        res.status(200).json({
            cursosInscritos : resultado.cursosInscritos,
            cursosAsistidos : resultado.cursosAsistidos
        })
    })
    .catch(err => {
        res.status(500).json(err);
    });
};

exports.post_new_estudiantes = (req,res,next)=>{
    Estudiante.find({carnet: req.body.carnet})
    .exec()
    .then(resultado =>{
        if(resultado.length>= 1){
            res.status(422).json({message: "Problema al generar cuenta"})
        }
        else{
            bcrypt.hash(req.body.secreto, 10, (err,hash)=>{
                if(err){
                    res.status(422).json({message: "Error al crear cuenta"});
                }
                else{
                    const estudianteNuevo = new Estudiante({
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    carnet: req.body.carnet,
                    secreto: hash,
                    horario: req.body.horario,
                    });
                    estudianteNuevo.save()
                    .then(respuesta =>{
                        res.status(201).json({message: 'Estudiante registrado'});
                    }).catch(err => {
                        res.status(500).json(err);
                    });
                }
            });
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
};

exports.post_new_login = (req,res,next)=>{
    Estudiante.findOne({carnet: req.body.carnet}).exec()
    .then(doc =>{
        if(!doc){
            res.status(401).json({message: "Falló al intentar logear"});
        }
        else{
            bcrypt.compare(req.body.secreto, doc.secreto, (err, result)=>{
                if(err){
                    estandar.errorChecker(res,err);
                }else{
                    if(result){
                        //Remplazar por ENV
                        const token = jwt.sign({
                            idUsuario: doc._id,
                            carnet: doc.carnet,
                            horario: doc.horario
                        },process.env.JWTSECRET, {
                            expiresIn: "4h"
                        });
                        res.status(200).json({message: token});
                    }
                    else{ 
                        res.status(500).json({message: "Falló al intentar logear"});
                    }
                }
            });
        }
    })
    .catch(err =>{
        res.status(500).json(err);
    })
};

exports.post_verificar_reserva = (req, res, next) =>{
    idCurso = req.params.idCurso;
    idUsuario = req.userData.idUsuario;
    horarioUsuario = req.userData.horario;
    var cursoDoc;
    var estudianteDoc;
    const promises = [];
    const standardPromise = [];
    //Establece las promesas
    standardPromise.push(Curso.findById(idCurso).exec()
        .then(cur =>{cursoDoc=cur}));
    standardPromise.push(Estudiante.findById(idUsuario)
        .select('cursosInscritos horario cursosAsistidos')
        .populate('cursosInscritos', 'hora numeroDia')
        .exec()
        .then(estu=> {estudianteDoc=estu}));
    //Las corre y espera la respuesta
    Promise.all(standardPromise)
    .then(corriendo =>{
        var estaInscrito = false;
        var horarioOcupado = false;
        if(cursoDoc.numeroDia==5 && !(estudianteDoc.cursosAsistidos.length>=2)){
            res.status(409).json({message:"Tienes que asistir al menos 2 cursos"});
        }
        else{
            estudianteDoc.cursosInscritos.forEach(arregloInscritos => {
                if(cursoDoc._id+""==arregloInscritos._id+""){
                    estaInscrito = true;
                }
                else{
                    if(cursoDoc.horario==arregloInscritos.horario){
                        horarioOcupado = true;
                    }
                    else if(cursoDoc.hora==arregloInscritos.hora && cursoDoc.numeroDia == arregloInscritos.numeroDia){
                        horarioOcupado = true;
                    }
                }
            });
            if(estaInscrito){
                promises.push(Estudiante.updateOne({_id:idUsuario},{ $pull: { cursosInscritos: idCurso}},{ multi: true }).exec());
                promises.push(Curso.updateOne({_id: idCurso},{ $pull: { inscritos: idUsuario}},{ multi: true }).exec());
                Promise.all(promises).then(resultadoPromesas=>{
                    res.status(200).json({message:"Curso removido"});
                })
                .catch(err=>{
                    res.status(500).json(err.message);
                });          
            }
            else{
                if(parseInt(cursoDoc.inscritos.length) < parseInt(cursoDoc.cupo)){
                    if(!horarioOcupado && estudianteDoc.horario != cursoDoc.horario){
                            promises.push(Estudiante.updateMany({_id: idUsuario},{$addToSet: {cursosInscritos:idCurso}}).exec());
                            promises.push(Curso.updateMany({_id: idCurso},{$addToSet: {inscritos:idUsuario}}).exec());
                            Promise.all(promises).then(resultadoPromesas=>{
                                res.status(200).json({message:"Curso reservado"});
                            })
                            .catch(err=>{
                                res.status(500).json(err.message);
                            });     
                    }
                    else{
                        res.status(409).json({message:"Conflico al intentar inscribir curso"});
                    }
                }
                else{
                    res.status(409).json({message:"Cupo lleno"});
                }
            }
        }
    }).catch(err =>{
        res.status(500).json(err.message);
    }); 
};

exports.delete_estudiante = (req, res, next)=>{
    const idEstudiante = req.params.idEstudiante;
    const promises = [];
    Estudiante.findById(id).exec()
    .then(estudianteDoc =>{
        if(estudianteDoc){
            promises.push(Curso.updateMany({_id: {$in: estudianteDoc.cursosInscritos}},
                { $pull: { inscritos: idEstudiante}},{ multi: true }).exec());
            //promises.push(Estudiante.remove({_id: idEstudiante}).exec());
            Promise.all(promises).then(resultadoPromesas=>{
                res.status(200).json({message:"Estudiante borrado"});
            })
            .catch(err=>{
                res.status(500).json(err.message);
            });
        }
        else{
            res.status(404).json({message: "Estudiante no encontrado"});
        }
    }).catch(err => {
        res.status(500).json(err);
    });
};

