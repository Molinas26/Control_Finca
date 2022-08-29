const express = require('express');
const router = express.Router();
const crudEmpleado = require("../controller/empleado");

router.get('/pendiente', crudEmpleado.listborr);

router.get('/sincronizado', crudEmpleado.listvald);

router.get('/create',crudEmpleado.create);

router.post('/create',crudEmpleado.save);

router.get('/cargar/:fecha',crudEmpleado.cargar);

router.get('/regresar/:fecha',crudEmpleado.regresar);

router.get('/:id',crudEmpleado.details);

router.get('/editar/:id',crudEmpleado.edit);

router.post('/editar/:id',crudEmpleado.update);

module.exports = router;