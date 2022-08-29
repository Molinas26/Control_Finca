const express = require('express');
const router = express.Router();

const conexion = require('../database/db');

router.get('/',(req, res)=>{
    conexion.query(
        "select * from areas",(error1, results1)=>{
        if(error1){
            throw error1;
        }else{
            res.render('control/index',{areas: results1.rows,}); 
            //res.send(results1)
        }
    })
    //res.render("programacion/create",{empleados: empleados.rows});
});

router.get('/:id',(req, res)=>{
    conexion.query("select * from sub_areas where id_area = "+req.params.id+" ",(error1, results1)=>{
        if(error1){
            throw error1;
        }else{
            conexion.query("select * from areas where id = "+req.params.id+" ",(error2, results2)=>{
                if(error2){
                    throw error2;
                }else{
                    res.render('control/subindex',{subareas: results1.rows,area: results2.rows[0], }); 
                    //res.send(results1)
                }
            })
            
        }
    })
    //res.render("programacion/create",{empleados: empleados.rows});
});

function sumarDias(fecha){
    fecha.setDate(fecha.getDate());
    return fecha;
}

var d = new Date();
var date = sumarDias(d)
var a = date.getFullYear() + '-'+ (date.getMonth() + 1) + '-' +  date.getDate();

router.get('/subarea/:id',(req, res)=>{
    conexion.query("select ROW_NUMBER() OVER() AS fila, empleados.id as id_empleado ,programacions.id as id, nombre_area ,nombre_subarea, concat(empleados.nombres_empleado, ' ' ,empleados.apellidos_empleado) as empleado_nombre, fecha, entradas.hora as hora_entrada, salidas.hora as hora_salida from programacions join empleados on empleados.id = programacions.id_empleado  join sub_areas on sub_areas.id = programacions.id_subarea  join areas on areas.id = sub_areas.id_area  left join entradas on entradas.id_programacions = programacions.id left join salidas on salidas.id_programacions = programacions.id  where fecha = '"+a+"' and id_subarea="+req.params.id+";",(error1, results1)=>{
        if(error1){
            throw error1;
        }else{
            conexion.query("select * from sub_areas where id = "+req.params.id+" ",(error2, results2)=>{
                if(error2){
                    throw error2;
                }else{
                    //res.send(results1)
                    res.render('control/list',{empleados: results1.rows,area: results2.rows[0], fecha: a,user:req.user,});
                }
            }) 
        }
    })
    //res.render("programacion/create",{empleados: empleados.rows});
});

module.exports = router;