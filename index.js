const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT && process.env.BIND_IP;

//Motor de vistas EJS
app.set('view engine', 'ejs');
app.use(ejsLayouts);

app.use(express.urlencoded({ extended:true }));

//Cargar modulo Routes
const router = require('./routes/routes');
app.use('/', router);

//Recursos Publicos
app.use(express.static('public'));

app.listen(port, () =>{
    console.log("Servidor activo en puerto 8080")
});
