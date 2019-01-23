
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../../client_secret.json');
var doc = new GoogleSpreadsheet(process.env.GOOGLESHEET);
const Curso = require('../models/curso');

exports.check_cred= (req, res, next) =>{
    doc.useServiceAccountAuth(creds,  (err) => {
        if(err){
            res.status(500).json(err);
        }
        next();
    });
}

/** Falta arreglar el JSON*/
exports.get_all = (req, res, next)=>{
    var C = {} 
    var key = 'cupos';
    C[key] = []; 
    doc.getCells(1, {'min-row': '2', 'min-col': '1', 'max-col': '11'}, (err, cells) => {
        if(err){
            res.status(500).json(err);
        }
        for(var i in cells){
            console.log(cells[i].value);
            C[key].push(cells[i].value);
        }
        res.status(200).json(C);
    });
}

exports.get_rows = (req, res, next)=>{
    doc.getRows(1, function (err, rows) {
        if(err){
            res.status(500).json(err);
        }
        console.log(rows);
        res.status(200).json(rows);
    });
}

exports.get_cupo = (req, res, next) =>{
    var C = {} 
    var key = 'cupos';
    C[key] = []; 
    doc.getCells(1, {'min-row': '2','max-row':'2', 'min-col': '12', 'max-col': '24'}, (err, cells)=>{
        if(err){
            res.status(500).json(err);
        }
        for(var i in cells){
            console.log(cells[i]);
            C[key].push(cells[i].value);
        }
        res.locals.cupo = C;
        res.status(200).json(C);
    });
}

exports.check_duplicate = (req,res,next)=>{
    doc.getCells(1, {'min-row': '2', 'min-col': '1', 'max-col': '1'}, (err, cells)=>{
        if(err){
            res.status(500).json(err);
        }
        req.registerUpdate = false;
        for(var i in cells){
            console.log(cells[i].value);
            if(req.body.carnet==cells[i].value){
                req.registerUpdate = true;
                req.rowUser = parseInt(i)+2;
                console.log(req.rowUser);
            }
        }
        next();
    });
}
/*
exports.post_exportar_clase = (req,res,next) =>{
    idCurso = req.params.idCurso;
    Curso.findById(idCurso)
    .populate('inscritos', '_id carnet nombre apellido')
    .exec()
    .then(result =>{
        if(result){
            for(var i in result.inscritos){
                
                doc.addRow(8+i,
                        {no:i,
                         nombrecompleto: result.inscritos[i].nombre + " " + result.inscritos[i].apellido,
                         nodecarne: result.inscritos[i].carnet,
                         aula: result.salon} )
            }
        }
        else{
            res.status(404).json({message: "No existe dicho curso"})
        }
    })
    .catch(err =>{
        res.status(500).json(err.message);
    });
};
*/
exports.post_curso = (req, res, next)=>{
    if(!req.registerUpdate){
        doc.addRow(1, { carnet: req.body.carnet, 
                        dia1: req.body.dia1,
                        dia2: req.body.dia2,
                        dia3: req.body.dia3,
                        dia4: req.body.dia4,
                        dia5: req.body.dia5,
                        dia6: req.body.dia6,
                        dia7: req.body.dia7,
                        dia8: req.body.dia8,
                        dia9: req.body.dia9,
                        dia10: req.body.dia10 }, (err)=> {
            if(err) {
                res.status(500).json(err);
            }
            res.status(200).json({message: "Usuario creado"});
        });
    }
    else{
        var values;
        doc.getCells(1, {'min-row': req.rowUser, 'max-row': req.rowUser, 
            'min-col': '1', 'max-col': '11'}, (err, cells)=>{
            if(err){
                res.status(500).json(err);
            }
            cells[1] = req.body.dia1;
            cells[2]= req.body.dia2;
            cells[3]= req.body.dia3;
            cells[4]=req.body.dia4;
            cells[5]=req.body.dia5;
            cells[6]=req.body.dia6;
            cells[7]=req.body.dia7;
            cells[8]=req.body.dia8;
            cells[9]=req.body.dia9;
            cells[10]=req.body.dia10;
            cells.save();
            res.status(200).json({message: "Usuario actualizado"})
        });
    }
}



//The response includes all cells in column 4, starting with row 2.
//GET https://spreadsheets.google.com/feeds/cells/key/worksheetId/private/full?min-row=2&min-col=4&max-col=4

