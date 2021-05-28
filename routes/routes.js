//Importar modulos
const express = require('express');
const path = require('path');
const spawn = require('child_process').spawn;

var myPythonScriptPath = 'recomendacion.py';
let {PythonShell} = require('python-shell');
var pyshell = new PythonShell(myPythonScriptPath);

//Creacion de objeto Router Express
const router = express.Router();

//Exportar modulo Routes
module.exports = router;

router.get('/', (req, res) =>{
    res.render('pages/home', {resultados: "", nombre: "", autor: "", mensaje: false});
});

router.post('/home', (req, res) =>{
    var resultados = [];
    nombre = req.body.nombre;
    autor = req.body.autor;
    let options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: 'public/pyScripts',
        args: [req.body.nombre, req.body.autor, req.body.cantidad]
      };
    
      PythonShell.run('recomendacion.py', options, function (err, results) {
        if (err) throw err;
        val = results.join('');
        console.log(val);
        resultados = val.split('@');
        if (resultados[0] == "Cancion no encontrada")
          mensaje = true
        else
          mensaje = false
        res.render('pages/home', {resultados, nombre, autor, mensaje});
      });
});

router.get('/about', (req, res) =>{
  res.render('pages/about');
});

router.get('/contact', (req, res) =>{
  res.render('pages/contact');
});
router.post('/contact', (req, res) =>{
  res.render('pages/contact');
});
