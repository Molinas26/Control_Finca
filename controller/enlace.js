const { body, validationResult } = require('express-validator');
const conexionlocal = require('../database/db');
const conexionodoo = require("../database/odoo")
const activityModel = require("../models/activity");
const enlaceModel = require("../models/enlace");
const employeeModel = require("../models/employee");

exports.actividad = (req, res, next) =>{
        activityModel.obtener().then(localactivity => {
            const loc = localactivity.rows;
            enlaceModel.cargaractividad().then(activity => {
                const act = activity.rows;
                loc.forEach(element => {
                    act.forEach(local => {
                        if (element.id == local.id) {
                            console.log('ya existe '+local.name)
                            activityModel.update(local.id, local.name, local.rate, local.tipo).then( acti => {
                                console.log('actualizado:  '+local.name)
                            })
                        }
                    });
                });
                act.forEach(element => {
                    var c =0;
                    loc.forEach(local => {
                        if (element.id == local.id) {
                            c++;
                        }
                    });
                    if(c == 0){
                        console.log('no existe '+element.name)
                        activityModel.insertar(element.id, element.name, element.rate, element.tipo).then( acti => {
                            console.log('creado:  '+element.name)
                        })
                    }
                });
                res.send(`
                    <link href="/resources/css/swwtalert2.min.css" rel="stylesheet" />
                    <script src="/resources/js/jqueryalert.min.js"></script>
                    <script src="/resources/js/sweetalert.min.js"></script>
                    <script>
                        $(document).ready(function(){
                            swal({
                                title: "Exitoso!",
                                text: "Los datos fueron vinculados exitosamente!",
                                type: "success",
                                showConfirmButton: false,
                                timer: 1500
                            }).then(function() {
                                // Redirect the user
                                window.location.href = "/configuracion/actividades";
                            });
                        });
                    </script>
                    `)
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
                            text: "No existe conexion a odoo!",
                            type: "error",
                            showConfirmButton: false,
                            timer: 1500
                        }).then(function() {
                            // Redirect the user
                            window.location.href = "/configuracion/actividades";
                        });
                    });
                </script>
                `)
            })

        })
}

exports.empleado = (req, res, next) =>{
    employeeModel.obtener().then(localemployee => {
        const loc = localemployee.rows;
        enlaceModel.settings().then(settings => {
            enlaceModel.cargaremployee(settings.rows[0].company_id).then(employee => {
                const act = employee.rows
                console.log("entrada al controlador: "+act);
                loc.forEach(element => {
                    act.forEach(local => {
                        if (element.id == local.id) {
                            console.log('ya existe '+local.name)
                            employeeModel.update(local.id, local.name, local.identity, local.birthday, local.department_id, local.name_department, local.job_id, local.name_job).then( emp => {
                                console.log('actualizado:  '+local.name)
                            })
                        }
                    });
                });
                act.forEach(element => {
                    var c =0;
                    loc.forEach(local => {
                        if (element.id == local.id) {
                            c++;
                        }
                    });
                    if(c == 0){
                        console.log('no existe '+element.name)
                        employeeModel.insertar(element.id, element.name, element.identity, element.birthday, element.department_id, element.name_department, element.job_id, element.name_job).then( acti => {
                            console.log('creado:  '+element.name)
                        })
                    }
                });
                res.send(`
                        <link href="/resources/css/swwtalert2.min.css" rel="stylesheet" />
                        <script src="/resources/js/jqueryalert.min.js"></script>
                        <script src="/resources/js/sweetalert.min.js"></script>
                        <script>
                            $(document).ready(function(){
                                swal({
                                    title: "Exitoso!",
                                    text: "Los datos fueron vinculados exitosamente!",
                                    type: "success",
                                    showConfirmButton: false,
                                    timer: 1500
                                }).then(function() {
                                    // Redirect the user
                                    window.location.href = "/configuracion/empleados";
                                });
                            });
                        </script>
                        `)
            })
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
                        text: "No existe conexion a odoo!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/configuracion/empleados";
                    });
                });
            </script>
            `)
        })

    })
}
