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

router.get('/:id',(req, res)=>{
    conexion.query("select empleados.id as id, nombre_area ,nombre_subarea, sub_areas.id as id_subarea, concat(empleados.nombres_empleado, ' ' ,empleados.apellidos_empleado) as empleado_nombre, fecha, entradas.hora as hora_entrada, salidas.hora as hora_salida from programacions join empleados on empleados.id = programacions.id_empleado  join sub_areas on sub_areas.id = programacions.id_subarea  join areas on areas.id = sub_areas.id_area  left join entradas on entradas.id_programacions = programacions.id left join salidas on salidas.id_programacions = programacions.id  where fecha = '"+a+"' and id_empleado="+req.params.id+";",(error1, results1)=>{
        if(error1){
            throw error1;
        }else{
            conexion.query('Select * from areas',(error2, results2)=>{
                if(error2){
                    throw error2;
                }else{
                    conexion.query('Select * from sub_areas',(error3, results3)=>{
                        if(error3){
                            throw error3;
                        }else{
                            res.render('traslado/dia',{empleado: results1.rows[0],areas: results2.rows,subareas: results3.rows, fecha: a, user:req.user, user:req.user,}); 
                        }
                    })
                }
            })
        }
    })
});

module.exports = router;