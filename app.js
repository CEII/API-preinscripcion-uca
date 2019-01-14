const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const express = require('express');
const app = express();


app.use(morgan('dev'));

//Conexion a la base datos
mongoose.connect(
    process.env.MONGOOSE_CONN, {
        useNewUrlParser: true 
 });

//Acepta cuerpos de url simple
app.use(bodyParser.urlencoded({extended: false}));
//Lee jsons
app.use(bodyParser.json());

//Rutas
const registrarRoutes = require('./API/routes/registrar');
const estudianteRoutes = require('./API/routes/estudiante');
const cursoRoutes = require('./API/routes/curso');

//Para evitar problemas de CORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET' 
        );
        return res.status(200).json({});
    }
    next();
});

//Rutas de la pagina
//app.use('/sistema/registrar', registrarRoutes);
app.use('/sistema/estudiantes', estudianteRoutes);
app.use('/sistema/cursos', cursoRoutes);

//Si nada se encuentra se corre
app.use((req,res,next)=> {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//En caso que nada se encuentre
app.use((error, req,res,next)=>{
    res.status(error.status  || 500);
    res.json({
        mensaje: error.message,
        estado: error.status 
    });
});

module.exports = app;

  
