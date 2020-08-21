const express = require('express');
const router = express.Router();

app.post('/resumen', (req, res) => {
    res.send('hola');
});

app.post('/resumen/getByRut', (req, res) => {
    res.send('hola');
});

app.post('/resumen/getByFecha', (req, res) => {
    res.send('hola');
});

app.post('/resumen/getByEstado', (req, res) => {
    res.send('hola');
});