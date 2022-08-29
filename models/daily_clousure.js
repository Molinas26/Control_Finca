const conexion = require("../database/db")
const conex = require("../database/odoo")

module.exports = {
    insertar(registration_date,responsability) {
        console.log("entrada a la funcion");
        return new Promise((resolve, reject) => {
            conexion.query(`insert into daily_closure_finca
                ( responsability, registration_date)
                values
                (`+responsability+`, '`+registration_date+`') RETURNING id`, 
                (err, resultados) => {
                        if (err) {reject(err);console.log(err)}  
                        else {
                            resolve(resultados);
                            console.log("Datos ingresados");
                        }
                });
        });
    },
    obtenerborrador() {
        return new Promise((resolve, reject) => {
            conexion.query(`select daily_closure_finca.*, name from daily_closure_finca join users on users.id = daily_closure_finca.responsability
            where state = false
            order by registration_date desc`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenervalidado() {
        return new Promise((resolve, reject) => {
            conexion.query(`select daily_closure_finca.*, name from daily_closure_finca join users on users.id = daily_closure_finca.responsability
            where state = true
            order by registration_date desc`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },

    obtenerfecha(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select daily_closure_finca.*, name from daily_closure_finca join users on users.id = daily_closure_finca.responsability where daily_closure_finca.id = `+id+``,
                (err, resultados) => {
                    if (err){ reject(err); console.log(err)}
                    else {resolve(resultados);}
                });
        });
    },
    cambiarestado(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`update daily_closure_finca
            set state = true
            where registration_date = $1`,
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    },

    estadocambiar(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`update daily_closure_finca
            set state = false
            where registration_date = $1`,
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    },
    obtenerporfecha(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select daily_closure_finca.*
            from daily_closure_finca 
            where daily_closure_finca.registration_date = '`+id+`'`,
                (err, resultados) => {
                    if (err){ reject(err); console.log(err)}
                    else {resolve(resultados);}
                });
        });
    },
    fechamayor() {
        return new Promise((resolve, reject) => {
            conexion.query(`SELECT COALESCE(MAX(daily_closure_finca.REGISTRATION_DATE)+ INTERVAL '1 day','2022-01-01') as mayor_fecha
            FROM daily_closure_finca
            JOIN daily_load_finca ON daily_load_finca.registration_date = daily_closure_finca.registration_date
            WHERE daily_closure_finca.state = true`,
                (err, resultados) => {
                    if (err){ reject(err); console.log(err)}
                    else {resolve(resultados);}
                });
        });
    },
    fechamayorsinvalidar() {
        return new Promise((resolve, reject) => {
            conexion.query(`SELECT COALESCE(MAX(daily_closure_finca.REGISTRATION_DATE)+ INTERVAL '1 day','2022-01-01') as mayor_fecha
            FROM daily_closure_finca
            JOIN daily_load_finca ON daily_load_finca.registration_date = daily_closure_finca.registration_date`,
                (err, resultados) => {
                    if (err){ reject(err); console.log(err)}
                    else {resolve(resultados);}
                });
        });
    },
}