const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');


const express = require('express');
const app = express();


app.use(morgan('dev'));


//Conexion a la base datos
mongoose.connect(
    'mongodb://shop-user:5MEGjBgDulqbVW8Z@storedatabase-shard-00-00-o0sy6.mongodb.net:27017,storedatabase-shard-00-01-o0sy6.mongodb.net:27017,storedatabase-shard-00-02-o0sy6.mongodb.net:27017/test?ssl=true&replicaSet=StoreDatabase-shard-0&authSource=admin&retryWrites=true', {
      useNewUrlParser: true 
 });

//Acepta cuerpos de url simple
app.use(bodyParser.urlencoded({extended: false}));
//Lee jsons
app.use(bodyParser.json());

//Rutas
const registrarRoutes = require('./site/routes/registrar');

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
//Configuracion de la pagina
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Rutas de la pagina
app.use('/sistema', registrarRoutes);

module.exports = app;

  
