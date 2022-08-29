const express = require('express');
const router = express.Router();
const crudEmpleado = require("../controller/configuracion");

router.get('/empleados', crudEmpleado.employee);
router.use('/sincronizar',require('./enlace'));
router.get('/actividades',crudEmpleado.activity);

module.exports = router;