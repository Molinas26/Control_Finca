const express = require('express');
const router = express.Router();

const conexion = require('../database/db');

router.get('/',(req, res)=>{
    res.render("programacion/index");
});

function sumarDias(fecha, dias){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

var d = new Date();
var date = sumarDias(d, 1)
var a = date.getFullYear() + '-'+ (date.getMonth() + 1) + '-' +  date.getDate();

router.get('/create',(req, res)=>{
    conexion.query("Select * from empleados where id not in (select empleados.id from empleados join programacions on programacions.id_empleado = empleados.id  where fecha = '"+a+"') order by id",(error1, results1)=>{
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
                            res.render('programacion/create',{empleados: results1.rows,areas: results2.rows,subareas: results3.rows, fecha: a, user:req.user,}); 
                        }
                    })
                }
            })
        }
    })
    //res.render("programacion/create",{empleados: empleados.rows});
    
});

const crud = require("../controller/programacion");
router.post('/save', crud.save);

var date2 = sumarDias(d, -1)
var b = date2.getFullYear() + '-'+ (date2.getMonth() + 1) + '-' +  date2.getDate();

router.get('/actual',(req, res)=>{
    conexion.query(
        "select programacions.id as id, nombre_area ,nombre_subarea,concat(empleados.nombres_empleado, ' ' ,empleados.apellidos_empleado) as empleado_nombre, fecha from programacions join empleados on empleados.id = programacions.id_empleado join sub_areas on sub_areas.id = programacions.id_subarea join areas on areas.id = sub_areas.id_area where fecha = '"+b+"'",(error1, results1)=>{
        if(error1){
            throw error1;
        }else{
            res.render('programacion/actual',{programa: results1.rows,fecha:b, user:req.user,}); 
            //res.send(results1)
        }
    })
    //res.render("programacion/create",{empleados: empleados.rows});
    
});

router.get('/tomorrow',(req, res)=>{
    conexion.query(
        "select programacions.id as id, nombre_area ,nombre_subarea,concat(empleados.nombres_empleado, ' ' ,empleados.apellidos_empleado) as empleado_nombre, fecha from programacions join empleados on empleados.id = programacions.id_empleado join sub_areas on sub_areas.id = programacions.id_subarea join areas on areas.id = sub_areas.id_area where fecha = '"+a+"'",(error1, results1)=>{
        if(error1){
            throw error1;
        }else{
            res.render('programacion/actual',{programa: results1.rows,fecha:a, user:req.user,}); 
            //res.send(results1)
        }
    })
    //res.render("programacion/create",{empleados: empleados.rows});
    
});

module.exports = router;