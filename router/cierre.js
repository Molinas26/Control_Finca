const express = require('express');
const router = express.Router();
const crudCreate = require("../controller/cierre");
const conexion = require('../database/db');

router.get('/',crudCreate.lista);

router.get('/validado',crudCreate.listavalid);

router.get('/detalle/:id/:fecha',crudCreate.detalle);

router.get('/detall/:id/:fecha',crudCreate.detalle2);

router.get('/create',crudCreate.crear);

router.get('/create/:fecha',crudCreate.creacion);

router.post('/create',crudCreate.save);

module.exports = router;