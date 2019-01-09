
const Curso = require('../models/curso');

exports.post_nuevo = (req,res,next)=>{
    Curso.update({},{$pull: { inscritos: req.body.carnet}}).exec().then(borrado =>{

    })
};
