const express = require('express');
const router = express.Router();

const auditoriaService = require('./src/service/auditoriaService');

router.get('/auditoria', async (req, res) => {
    res.send(await auditoriaService.insert('uno'));
})

app.post('/auditoria/getById', (req, res) => {
    res.send('hola');
});

app.post('/auditoria/guardarCaso', (req, res) => {
    res.send('hola');
});

app.post('/auditoria/getByAudio', (req, res) => {
    res.send('hola');
});

module.exports = router;