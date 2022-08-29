const express = require('express');
const router = express.Router();

const conexion = require('../database/db');

router.get('/',(req, res)=>{
    res.render('home',{user:req.user,});
});

router.use('/configuracion',require('./configuraciones'));

router.use('/empleado',require('./empleado'));

router.use('/cierrediario',require('./cierre'));

module.exports = router;