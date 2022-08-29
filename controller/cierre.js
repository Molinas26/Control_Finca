const { body, validationResult } = require('express-validator');
const conexion = require('../database/db');
const dailyModel = require("../models/daily_load");
const employee = require('../models/employee');
const clouse = require("../models/daily_clousure");
const clousedetail = require("../models/daily_clousure_details");
const clouseModel = require("../models/daily_clousure");

exports.listavalid = (req, res, next) =>{
    clouse.obtenervalidado().then(clouse => {
        res.render("cierre/indexpen",{user:req.user,lista:clouse.rows});
    }).catch(err=>{
        res.send(`
        <link href="/resources/css/swwtalert2.min.css" rel="stylesheet" />
        <script src="/resources/js/jqueryalert.min.js"></script>
        <script src="/resources/js/sweetalert.min.js"></script>
        <script>
            $(document).ready(function(){
                swal({
                    title: "Error!",
                    text: "Error al obtener los datos!",
                    type: "error",
                    showConfirmButton: false,
                    timer: 1500
                }).then(function() {
                    // Redirect the user
                    window.location.href = "/";
                });
            });
        </script>
        `)
    });
}

exports.lista = (req, res, next) =>{
    clouse.obtenerborrador().then(clouse => {
        res.render("cierre/index",{user:req.user,lista:clouse.rows});
    }).catch(err=>{
        res.send(`
        <link href="/resources/css/swwtalert2.min.css" rel="stylesheet" />
        <script src="/resources/js/jqueryalert.min.js"></script>
        <script src="/resources/js/sweetalert.min.js"></script>
        <script>
            $(document).ready(function(){
                swal({
                    title: "Error!",
                    text: "Error al obtener los datos!",
                    type: "error",
                    showConfirmButton: false,
                    timer: 1500
                }).then(function() {
                    // Redirect the user
                    window.location.href = "/";
                });
            });
        </script>
        `)
    });
}

exports.crear = (req, res, next) =>{
    clouseModel.fechamayor().then(fecha => {
        clouseModel.fechamayorsinvalidar().then(fecha => {
                res.render("cierre/create",{user:req.user,mayor:fecha.rows[0]});
        })
    })
    
}

exports.detalle = (req, res, next) =>{
    clouse.obtenerfecha(req.params.id).then(clouse => {
        dailyModel.obtenerPorDate(req.params.fecha).then(detail => {
            console.log("Hola "+req.user.id+"-"+req.params.fecha+"-"+detail.rows+"-"+clouse.rows[0].name);
            console.log(detail.rows);
            res.render("cierre/show",{user:req.user.id,fecha:req.params.fecha,daily:detail.rows,responsable:clouse.rows[0].name});
        });
    });
}

exports.detalle2 = (req, res, next) =>{
    clouse.obtenerfecha(req.params.id).then(clouse => {
        dailyModel.obtenerPorDate(req.params.fecha).then(detail => {
            console.log("Hola "+req.user.id+"-"+req.params.fecha+"-"+detail.rows+"-"+clouse.rows[0].name);
            console.log(detail.rows);
            res.render("cierre/show2",{user:req.user.id,fecha:req.params.fecha,daily:detail.rows,responsable:clouse.rows[0].name});
        });
    });
}

exports.creacion = (req, res, next) =>{
    console.log('entrada a la funcion '+req.params.fecha)
    dailyModel.obtenerPorDate(req.params.fecha).then(daily => {
        clouseModel.fechamayorsinvalidar().then(fecha => {
            res.render("cierre/create",{user:req.user,daily:daily.rows,fecha:req.params.fecha,mayor:fecha.rows[0]});
        })
       
    }).catch(err => {
        console.log(err);
        res.send(`
            <link href="/resources/css/swwtalert2.min.css" rel="stylesheet" />
            <script src="/resources/js/jqueryalert.min.js"></script>
            <script src="/resources/js/sweetalert.min.js"></script>
            <script>
                $(document).ready(function(){
                    swal({
                        title: "Error!",
                        text: "Los datos no pudieron ser recuperados exitosamente!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/cierrediario/create";
                    });
                });
            </script>
            `)
    });
}

exports.save = (req, res, next)=>{
    const responsable = req.body.usuario;
    const fecha = req.body.fecha;
    clouse.obtenerporfecha(fecha).then(fech =>{
        if (fech.rows[0]) {
            var myArray = [];
            myArray.push('Ya existe un cierre diario con esta fecha');
            clouseModel.fechamayorsinvalidar().then(fecha => {
                res.render("cierre/create",{user:req.user,daily:daily.rows,fecha:req.params.fecha,mayor:fecha.rows[0],mensaje:myArray});
            })
        } else {
            clouse.insertar(fecha,req.user.id).then(daily => {
                dailyModel.obtenerPorDate(fecha).then(dailys => {
                    res.redirect("/cierrediario/detalle/"+daily.rows[0].id+"/"+req.body.fecha);
                })
            });  
        }
    });
}