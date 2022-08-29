const express = require('express');
const router = express.Router();
const crudEnlace = require("../controller/enlace");

router.get('/actividad',crudEnlace.actividad);

router.get('/empleado',crudEnlace.empleado);

module.exports = router;