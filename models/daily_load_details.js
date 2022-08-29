const conexion = require("../database/db")
const conex = require("../database/odoo")

module.exports = {
    insertar(activity_id, daily_load_finca_id, amount, hora) {
        if(typeof amount == 'undefined'){
            amount = 0;
        }
        if(typeof hora == 'undefined'){
            hora = 0;
        }
        return new Promise((resolve, reject) => {
            conexion.query(`insert into daily_load_finca_detail
            (activity_id, daily_load_finca_id, amount, hour)
            values
            ($1,$2,$3,$4)`,
                [activity_id, daily_load_finca_id, amount,hora], (err, resultados) => {
                    if (err){ 
                        reject(err); 
                        console.log(err);
                    }else {resolve(resultados.insertId)};
                });
        });
    },
    insertarodoo(activity_id, qty, rate, farm_daily_load_id,hour) {
        console.log("probando "+farm_daily_load_id)
        return new Promise((resolve, reject) => {
            conex.query(`insert into farm_daily_load_detail
            (activity_id, qty, rate, farm_daily_load_id, hours)
            values
            (`+activity_id+`, `+qty+`, `+rate+`, `+farm_daily_load_id+`, `+hour+`) RETURNING id`, (err, resultados) => {
                    if (err){ 
                        reject(err); 
                        console.log(err);
                    }else {resolve(resultados)};
                });
        });
    },
    obtener() {
        return new Promise((resolve, reject) => {
            conexion.query(`select * from daily_load_finca_detail`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select * from daily_load_finca_detail where id = ?`,
                [id],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados[0]);
                });
        });
    },
    obtenerPorDaily(id_daily) {
        return new Promise((resolve, reject) => {
            conexion.query(`select ROW_NUMBER() OVER() AS fila,daily_load_finca_detail.id, daily_load_finca_id, amount, name, rate,hour, activity_id 
            from daily_load_finca_detail join activity on activity.id = daily_load_finca_detail.activity_id 
            where daily_load_finca_id = `+id_daily+``,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    actualizar(activity_id, daily_load_finca_id, amount, id, hora) {
        if(typeof amount == 'undefined'){
            amount = 0;
        }
        if(typeof hora == 'undefined'){
            hora = 0;
        }
        console.log('entrada a la funcion'+activity_id+', '+daily_load_finca_id+', '+amount+', '+hora);
        return new Promise((resolve, reject) => {
            console.log('ejecuta el update');
            conexion.query(`update daily_load_finca_detail
            set activity_id = `+activity_id+`,
            amount = `+amount+`,
            hour = `+hora+`
            where id = `+id+``,
                (err, resultados) => {
                    if (err){reject(err);console.log(err);}
                    else {resolve(resultados);console.log('se actualizo');}
                });
        });
    },
    borrarodoo(id) {
        return new Promise((resolve, reject) => {
            conex.query(`delete from farm_daily_load_detail
                where farm_daily_load_id is null`, 
                (err, resultados) => {
                        if (err) {reject(err);console.log(err)}  
                        else {
                            resolve(resultados);
                        }
                });
        });
    },
    borrarpordaily(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`delete from daily_load_finca_detail
                where daily_load_finca_id = `+id+``, 
                (err, resultados) => {
                        if (err) {reject(err);console.log(err)}  
                        else {
                            resolve(resultados);
                        }
                });
        });
    },
}