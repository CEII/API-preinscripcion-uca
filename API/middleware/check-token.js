const jwt = require('jsonwebtoken');

//Verify the token and request data from it
module.exports = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWTSECRET, null);
        req.userData = decoded;
        next();
    }catch(error){
        res.status(401).json({message: "No tiene permisos para realizar esta accion"});
    }
};