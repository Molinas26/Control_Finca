const express = require('express');
const router = express.Router();

const conexion = require('../database/db');

function sumarDias(fecha){
    fecha.setDate(fecha.getDate());
    return fecha;
}

var d = new Date();
var date = sumarDias(d)
var a = date.getFullYear() + '-'+ (date.getMonth() + 1) + '-' +  date.getDate();

router.get('/',(req, res)=>{
    conexion.query("select programacions.id as id, nombre_area ,nombre_subarea, concat(empleados.nombres_empleado, ' ' ,empleados.apellidos_empleado) as empleado_nombre, fecha, entradas.hora as hora_entrada, salidas.hora as hora_salida from programacions join empleados on empleados.id = programacions.id_empleado  join sub_areas on sub_areas.id = programacions.id_subarea  join areas on areas.id = sub_areas.id_area  left join entradas on entradas.id_programacions = programacions.id left join salidas on salidas.id_programacions = programacions.id where fecha = '"+a+"'",(error1, results1)=>{
        if(error1){
            throw error1;
        }else{
            res.render('eys/index',{lista: results1.rows,fecha:a,user:req.user,}); 
            //res.send(results1)
        }
    })
    //res.render("programacion/create",{empleados: empleados.rows});
});

module.exports = router;