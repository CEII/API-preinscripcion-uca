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
                        },"secret_preU0993281A",{
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
    Curso.findById(idCurso).exec()
    .then(cursoDoc =>{
        Estudiante.findById(idUsuario)
        .select('cursosInscritos horario')
        .populate('Cursos', 'hora cursosInscritos')
        .exec().then(estudianteDoc=>{
            var estaInscrito = false;
            var horarioOcupado = false;
            estudianteDoc.cursosInscritos.forEach(arregloInscritos => {
                if(cursoDoc._id+""==arregloInscritos._id+""){
                    estaInscrito = true;
                }
                else{
                    if(cursoDoc.horario==arregloInscritos.horario){
                        horarioOcupado = true;
                    }
                    else if(cursoDoc.hora==arregloInscritos.hora){
                        horarioOcupado = true;
                    }
                }
            });
            if(estaInscrito){
                try{
                    Estudiante.updateOne({_id:idUsuario},{ $pull: { cursosInscritos: idCurso}},{ multi: true }).exec();
                    Curso.updateOne({_id: idCurso},{ $pull: { inscritos: idUsuario}},{ multi: true }).exec();
                }
                catch (err){
                    res.status(500).json(err.message);
                    return;
                }
                res.status(200).json({message:"Curso removido"});
            }
            else{
                if(parseInt(cursoDoc.inscritos.length) < parseInt(cursoDoc.cupo) && !horarioOcupado &&
                    estudianteDoc.horario != cursoDoc.horario){
                        try{
                            Estudiante.updateMany({_id: idUsuario},{$addToSet: {cursosInscritos:idCurso}}).exec();
                            Curso.updateMany({_id: idCurso},{$addToSet: {inscritos:idUsuario}}).exec();
                        }
                        catch(err){
                            res.status(500).json(err.message);
                            return;
                        }
                        res.status(200).json({message:"Curso reservado"});
                }
                else{
                    res.status(409).json({message:"Conflico al intentar inscribir curso"});
                }
            }
        }).catch(err=>{
            res.status(500).json(err.message);
        });
    }).catch(err =>{
        res.status(500).json(err.message);
    });
    
};

exports.delete_estudiante = (req, res, next)=>{
    const id = req.params.idEstudiante;
    Estudiante.remove({_id: id}).exec().then(result => {
        res.status(200).json({message: "Estudiante borrado"});
    }).catch(err => {
        res.status(500).json(err);
    }); 
};

