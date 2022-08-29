const { body, validationResult } = require('express-validator');
const conexion = require('../database/db');
const employeeModel = require("../models/employee");
const activityModel = require("../models/activity");

exports.employee = (req, res, next) =>{
    employeeModel.obtener().then(lista => {
        let mensaje = "";
        res.render("configuraciones/empleados", {
            lista: lista.rows,user:req.user, mensaje:mensaje,
        });
    })
    .catch(err => {
        res.send(`
            <link href="/resources/css/swwtalert2.min.css" rel="stylesheet" />
            <script src="/resources/js/jqueryalert.min.js"></script>
            <script src="/resources/js/sweetalert.min.js"></script>
            <script>
                $(document).ready(function(){
                    swal({
                        title: "Error!",
                        text: "Los datos de empleado no pudieron ser recuperados exitosamente!",
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

exports.activity = (req, res, next) =>{
    activityModel.obtener().then(lista => {
        let mensaje = "";
        res.render("configuraciones/actividad", {                    
            lista: lista.rows,user:req.user, mensaje:mensaje,
        });
    })
    .catch(err => {
        res.send(`
            <link href="/resources/css/swwtalert2.min.css" rel="stylesheet" />
            <script src="/resources/js/jqueryalert.min.js"></script>
            <script src="/resources/js/sweetalert.min.js"></script>
            <script>
                $(document).ready(function(){
                    swal({
                        title: "Error!",
                        text: "Los datos de actividades no pudieron ser recuperados exitosamente!",
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