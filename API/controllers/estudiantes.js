const Estudiante = require('../models/estudiante');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.post_new_estudiantes = (req,res,next)=>{
    const iden = req.body.identificador;
    console.log(iden)
    Estudiante.find({carnet: req.body.carnet})
    .exec()
    .then(resultado =>{
        if(resultado.length>= 1){
            res.status(500).json({message: "Problema al generar cuenta"})
        }
        else{
            bcrypt.hash(req.body.secreto, 10, (err,hash)=>{
                if(err){
                    res.status(500).json({message: "Error al crear cuenta"});
                }
                else{
                    const estudianteNuevo = new Estudiante({
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    carnet: req.body.carnet,
                    secreto: hash,
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

exports.get_all_estudiantes = (req, res, next)=>{
    Estudiante.find({}).sort({carnet: 1})
    .select('_id carnet nombre apellido')
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
                }
            })
        });
    }).catch(err => {
        res.status(500).json(err);
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

exports.post_new_login = (req,res,next)=>{
    Estudiante.findOne({carnet: req.body.carnet}).exec()
    .then(doc =>{
        if(!doc){
            res.status(500).json({message: "Falló al intentar logear"});
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
