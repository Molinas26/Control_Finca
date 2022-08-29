const { body, validationResult } = require('express-validator');
const conexion = require('../database/db');
const employeeModel = require("../models/employee");
const activityModel = require("../models/activity");
const dailyModel = require("../models/daily_load");
const obsModel = require("../models/daily_load_details");
const employee = require('../models/employee');
const enlaceModel = require("../models/enlace");
const clouseModel = require("../models/daily_clousure");

exports.listborr = (req, res, next) =>{
    dailyModel.obtenerborradores().then(employee => {
        res.render("empleado/index", {
            employee: employee.rows,user:req.user,
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
                    text: "Los datos de carga diaria no pudieron ser recuperados!",
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

exports.listvald = (req, res, next) =>{
    dailyModel.obtenervalidado().then(employee => {
        res.render("empleado/index2", {
            employee: employee.rows,user:req.user,
        });
    });
}

exports.create = (req, res, next) =>{
    employeeModel.obtener().then(employee => {
        activityModel.obtener().then(activity => {
            clouseModel.fechamayor().then(fecha => {
                dailyModel.fechamayorodoo().then(fechaodoo => {
                    if (fecha.rows[0].mayor_fecha >= fechaodoo.rows[0].mayor_fecha) {
                        res.render(
                            'empleado/create',{employee: employee.rows, actividad: activity.rows, user:req.user, mayor:fecha.rows[0]
                        });
                    } else {
                        res.render(
                            'empleado/create',{employee: employee.rows, actividad: activity.rows, user:req.user, mayor:fechaodoo.rows[0]
                        });
                    }
                })
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
                        text: "Los datos de actividades no pudieron ser recuperados!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/pendiente";
                    });
                });
            </script>
            `)
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
                        text: "Los datos de empleado no pudieron ser recuperados!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/pendiente";
                    });
                });
            </script>
            `)
    });
}

exports.regresar = (req, res, next) =>{
    dailyModel.cierreValidado(req.params.fecha).then(localfinca => {
        if (localfinca.rows[0]) {
            res.send(`
            <link href="/resources/css/swwtalert2.min.css" rel="stylesheet" />
            <script src="/resources/js/jqueryalert.min.js"></script>
            <script src="/resources/js/sweetalert.min.js"></script>
            <script>
                $(document).ready(function(){
                    swal({
                        title: "Error!",
                        text: "Los datos de esta fecha ya fueron sincronizados!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/cierrediario/validado";
                    });
                });
            </script>
            `)
        } else {
            dailyModel.borrarodoo(req.params.fecha).then(localfinca => {
                console.log("borrar "+localfinca.rows[0].id);
                obsModel.borrarodoo(localfinca.rows[0].id).then(localfincadetail => {
                
                });
            });
            clouseModel.estadocambiar(req.params.fecha).then(cambio =>{
            });
            dailyModel.estadocambiar(req.params.fecha).then(cambio =>{
            });
        
            res.redirect("/cierrediario");
        }
    });
}

exports.cargar = (req, res, next) =>{
    enlaceModel.cargaractividad().then(activity => {
        dailyModel.obtenerborrador(req.params.fecha).then(localfinca => {
            const act = localfinca.rows;
            act.forEach(local => {
                console.log("entreo parte A "+local.employee_id+" "+local.department_id+" "+local.job_id+" "+req.params.fecha+" "+1+" "+local.state);
                dailyModel.insertarodoo(local.employee_id, local.department_id, local.job_id, req.params.fecha, 1, local.state).then( emp => {
                    console.log("entro parte B")
                    obsModel.obtenerPorDaily(local.id).then(deta =>{
                        const det = deta.rows;
                        console.log("entro parte C")
                        det.forEach(details =>{
                            obsModel.insertarodoo(details.activity_id,details.amount,details.rate,emp.rows[0].id, details.hour).then(det =>{
                            }).catch(err =>{

                            });
                            clouseModel.cambiarestado(req.params.fecha).then(cambio =>{
                            });
                        })
                    }).catch(err => {
                    });
                    dailyModel.cambiarestado(local.id).then(cambio =>{
                    });
                })
            });
        })
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
                    window.location.href = "/cierrediario";
                });
            });
        </script>
        `)
    }).catch(err => {
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
                    window.location.href = "/empleado/pendiente";
                });
            });
        </script>
        `)
    });
}

exports.save = (req, res, next) =>{
    const empleado = req.body.empleado;
    const fecha = req.body.fecha;
    const dis = req.body.dia;
    var fila = parseInt(req.body.fila);


    var myArray = [];

    if(empleado == ''){
        myArray.push('El empleado no puede ser vacio');
    }else{
        employeeModel.obtenerPorEmployee(empleado).then(employee => {
            var im = 0;
            const emp = employee.rows;
            emp.forEach(element => {
                im=1;
            });
            if (im == 0) {
                myArray.push('El empleado no existe');
            } 
        }).catch(err => {
            myArray.push('El empleado no existe');
        })
    }
    if(fecha == ''){
        myArray.push('La fecha no puede ser vacia');
    }
    
        for (let index = 1; index <= fila; index++) {
            const na = req.body[`actividad${index}`];
            const nc = req.body[`cantidad${index}`];

            if (na == "") {
                myArray.push('El nombre del articulo '+index+' no puede estar vacio');
            }
            if (nc == "") {
                myArray.push('La cantidad del articulo '+index+' no puede estar vacia');
            }

        }

    if (myArray.length > 0) {
        employeeModel.obtener().then(employee => {
            activityModel.obtener().then(activity => {
                res.render(
                    'empleado/create',{employee: employee.rows, actividad: activity.rows, user:req.user, mensaje:myArray,
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
                                text: "Los datos de actividades no pudieron ser recuperados!",
                                type: "error",
                                showConfirmButton: false,
                                timer: 1500
                            }).then(function() {
                                // Redirect the user
                                window.location.href = "/empleado/create";
                            });
                        });
                    </script>
                    `)
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
                        text: "Los datos de empleado no pudieron ser recuperados!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/create";
                    });
                });
            </script>
            `)
        });
    } else {
        console.log("probando 1");
    employeeModel.obtenerPorEmployee(empleado).then(employee => {
        console.log("probando 2"+employee.rows[0].id+" "+fecha+" "+req.user.id);
        dailyModel.insertar(employee.rows[0].id, fecha, req.user.id).then(daily => {
            console.log("probando 3"+daily.rows[0].id);
                for (let index = 1; index <= fila; index++) {
                    console.log("ciclo recorre en "+index);
                    const acti = req.body[`actividad${index}`];
                    const cantidad = req.body[`cantidad${index}`];
                    const hora = req.body[`hora${index}`];
                    console.log("fila va en"+fila);
                    if(typeof acti == 'undefined'){

                    }else{
                    activityModel.obtenerPorName(acti).then(activity => {
                        console.log('probando 4'+activity.rows[0].id+' '+daily.rows[0].id+' '+cantidad);
                        obsModel.insertar(activity.rows[0].id ,daily.rows[0].id, cantidad, hora).then(details => {                  
                        })     
                    })  
                }              
                }
            res.redirect("/empleado/"+daily.rows[0].id);
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
                        text: "Los datos no pudieron ser cargados exitosamente!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/create";
                    });
                });
            </script>
            `)
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
                        text: "Los datos de empleado no pudieron ser recuperados!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/create";
                    });
                });
            </script>
            `)
    });
            
    }
}


exports.details = (req, res, next) =>{
    dailyModel.obtenerPorId(req.params.id).then(daily => {
        obsModel.obtenerPorDaily(daily.rows[0].id).then(details => {
            res.render("empleado/details", {
                daily:daily.rows[0],user:req.user,details:details.rows,
            });
            console.log(details.rows);
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
                        text: "Los datos no pudieron ser recuperados exitosamente!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/pendiente";
                    });
                });
            </script>
            `)
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
                        text: "Los datos no pudieron ser recuperados exitosamente!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/pendiente";
                    });
                });
            </script>
            `)
    });
}

exports.edit = (req, res, next) =>{
    dailyModel.obtenerPorId(req.params.id).then(daily => {
        obsModel.obtenerPorDaily(daily.rows[0].id).then(details => {
            employeeModel.obtener().then(employee => { 
                activityModel.obtener().then(activity => { 
                    clouseModel.fechamayor().then(fecha => {
                        dailyModel.fechamayorodoo().then(fechaodoo => {
                            if (fecha.rows[0].mayor_fecha >= fechaodoo.rows[0].mayor_fecha) {
                                res.render("empleado/edit", {
                                    daily:daily.rows[0],user:req.user,details:details.rows,employee:employee.rows,actividad:activity.rows,mayor:fecha.rows[0]
                                });
                            } else {
                                res.render("empleado/edit", {
                                    daily:daily.rows[0],user:req.user,details:details.rows,employee:employee.rows,actividad:activity.rows,mayor:fechaodoo.rows[0]
                                });
                            }
                        })
                    })
                }).catch(err => {
                    res.send(`
                    <link href="/resources/css/swwtalert2.min.css" rel="stylesheet" />
                    <script src="/resources/js/jqueryalert.min.js"></script>
                    <script src="/resources/js/sweetalert.min.js"></script>
                    <script>
                        $(document).ready(function(){
                            swal({
                                title: "Error!",
                                text: "Los empleados no pudieron ser recuperados exitosamente!",
                                type: "error",
                                showConfirmButton: false,
                                timer: 1500
                            }).then(function() {
                                // Redirect the user
                                window.location.href = "/empleado/pendiente";
                            });
                        });
                    </script>
                    `)
                });
            }).catch(err => {
                res.send(`
                <link href="/resources/css/swwtalert2.min.css" rel="stylesheet" />
                <script src="/resources/js/jqueryalert.min.js"></script>
                <script src="/resources/js/sweetalert.min.js"></script>
                <script>
                    $(document).ready(function(){
                        swal({
                            title: "Error!",
                            text: "Los empleados no pudieron ser recuperados exitosamente!",
                            type: "error",
                            showConfirmButton: false,
                            timer: 1500
                        }).then(function() {
                            // Redirect the user
                            window.location.href = "/empleado/pendiente";
                        });
                    });
                </script>
                `)
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
                        text: "Los datos no pudieron ser recuperados exitosamente!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/pendiente";
                    });
                });
            </script>
            `)
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
                        text: "Los datos no pudieron ser recuperados exitosamente!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/pendiente";
                    });
                });
            </script>
            `)
    });
}

exports.update = (req, res, next) =>{
    const empleado = req.body.empleado;
    const fecha = req.body.fecha;
    var fila = parseInt(req.body.fila);
    const id = req.params.id;

    var myArray = [];

    if(empleado == ''){
        myArray.push('El empleado no puede ser vacio');
    }else{
        employeeModel.obtenerPorEmployee(empleado).then(employee => {
            var im = 0;
            const emp = employee.rows;
            emp.forEach(element => {
                im=1;
            });
            if (im == 0) {
                myArray.push('El empleado no existe');
            } 
        }).catch(err => {
            myArray.push('El empleado no existe');
        })
    }
    if(fecha == ''){
        myArray.push('La fecha no puede ser vacia');
    }
    
        for (let index = 1; index <= fila; index++) {
            const na = req.body[`actividad${index}`];
            const nc = req.body[`cantidad${index}`];

            if (na == "") {
                myArray.push('El nombre del articulo '+index+' no puede estar vacio');
            }
            if (nc == "") {
                myArray.push('La cantidad del articulo '+index+' no puede estar vacia');
            }


    }
    console.log("hola"+myArray.length);
    if (myArray.length > 0) {
        employeeModel.obtener().then(employee => {
            activityModel.obtener().then(activity => {
                res.render(
                    'empleado/create',{employee: employee.rows, actividad: activity.rows, user:req.user, mensaje:myArray,
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
                                text: "Los datos de actividades no pudieron ser recuperados!",
                                type: "error",
                                showConfirmButton: false,
                                timer: 1500
                            }).then(function() {
                                // Redirect the user
                                window.location.href = "/empleado/editar/`+req.params.id+`";
                            });
                        });
                    </script>
                    `)
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
                        text: "Los datos de empleado no pudieron ser recuperados!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/editar/`+req.params.id+`";
                    });
                });
            </script>
            `)
        });
    } else {
        console.log(empleado)
    employeeModel.obtenerPorEmployee(empleado).then(employee => {
        console.log("entra aqui"+employee.rows[0].id+""+fecha+""+req.user.id+""+req.params.id);
        dailyModel.update(employee.rows[0].id, fecha, req.user.id,req.params.id).then(daily => {
            obsModel.borrarpordaily(daily.rows[0].id).then(eliminar =>{
            });
console.log("entra aqui2");
                for (let index = 1; index <= fila; index++) {
                    console.log("ciclo recorre en "+index);
                    const acti = req.body[`actividad${index}`];
                    const cantidad = req.body[`cantidad${index}`];
                    const hora = req.body[`hora${index}`];
                    const identificador = req.body[`identificador${index}`];
                    console.log("fila va en"+fila);
                    if(typeof acti == 'undefined'){
                        fila=  parseInt(fila) + parseInt(1);
                        console.log("fila va ahora en"+fila);
                    }else{
                        activityModel.obtenerPorName(acti).then(activity =>     {
                            obsModel.insertar(activity.rows[0].id ,daily.rows[0].id, cantidad,hora).then(details => {                           
                            })
                    })
                    }
                }
            
                //res.redirect("/empleado/"+daily.rows[0].id);
                res.send(`<script>window.location.href = "/empleado/`+id+`"</script>`);
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
                        text: "Los datos de empleado no pudieron ser recuperados!",
                        type: "error",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(function() {
                        // Redirect the user
                        window.location.href = "/empleado/editar/`+id+`";
                    });
                });
            </script>
            `)
    });
            
}
}

