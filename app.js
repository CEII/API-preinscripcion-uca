const bodyParser = require('body-parser');
const path = require('path');

const express = require('express');
const app = express();

const registrarRoutes = require('./site/routes/registrar');

//Acepta cuerpos de url simple
app.use(bodyParser.urlencoded({extended: false}));
//Lee jsons
app.use(bodyParser.json());

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

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*app.get('/', (req, res, next)=>{
    res.render('pages/index')
});*/

app.use('/curso', registrarRoutes);

module.exports = app;

  
