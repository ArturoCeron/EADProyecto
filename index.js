/*-----------------Aqui Inicia------------------------------ */
const passport=require('passport');
const cookieParser=require('cookie-parser');
const session= require('express-session');
const PassportLocal=require('passport-local').Strategy;
/*------------------Aqui termina--------------------------- */

const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();

const port = process.env.PORT || 8080;
/* -------------------Aqui Inicia----------------------------*/
app.use(express.urlencoded({extended:true}));
app.use(cookieParser('algo de configuración secreta'));
app.use(session({
    secret:'configuración secreta',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(function(username,password,done){
    if (username==="arturo" && password==="1234") {
        return done(null,{id:1,name:"Arturo"});
    }
    done(null,false);
}));
//Serializacion
passport.serializeUser(function(user,done){
    done(null,user.id);
})
//Deserializacion
passport.deserializeUser(function(id,done){
    done(null,{id:1, name:"Arturo"});
})
/*-----------------------------------------------------*/
// app.get("/",(req,res, next)=>{
//     //Si ya iniciamos sesion mostrares una vista de bienvenida
//     //Si no hemos iniciado sesion, regresaremos al login
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         res.redirect("/login");
//     }
// },(req,res)=>{
//     res.redirect("/contact");
// });

/* -------------------------------------------------------------*/
// app.get("/login", (req,res)=>{
//     //Mostar formulario de login
//     res.render("login");
// });

// app.post("/login", passport.authenticate('local',{
//     successRedirect:"/",
//     failureRedirect:"/login"
// }));
/* -------------------Aqui termina----------------------------*/
//Motor de vistas EJS
app.set('view engine', 'ejs');
app.use(ejsLayouts);

//Recursos Publicos
app.use(express.static('public'));

app.use(express.urlencoded({ extended:true }));

//Cargar modulo Routes
const router = require('./routes/routes');
app.use('/', router);



app.listen(port, () =>{
    console.log("Servidor activo en puerto 8080")
});