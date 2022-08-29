const conexion = require("../database/db")

module.exports = {
    insertar(id, name, rate, dia) {
        return new Promise((resolve, reject) => {
            conexion.query(`insert into activity
            (id, name, rate, dia)
            values
            ($1,$2,$3, $4)`,
                [id, name, rate, dia], (err, resultados) => {
                    if (err){ 
                        reject(err); 
                        console.log(err);
                    }else {resolve(resultados.insertId)};
                });
        });
    },

    update(id, name, rate, dia) {
        return new Promise((resolve, reject) => {
            conexion.query(`update activity set
            name = $2, rate = $3, dia=$4 where id = $1`,
                [id, name, rate, dia], (err, resultados) => {
                    if (err){ 
                        reject(err); 
                        console.log(err);
                    }else {resolve(resultados.insertId)};
                });
        });
    },
    obtener() {
        return new Promise((resolve, reject) => {
            conexion.query(`select ROW_NUMBER() OVER() AS fila, * from activity`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select * from activity where id = ?`,
                [id],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados[0]);
                });
        });
    },
    obtenerPorName(name) {
        console.log("entro "+name);
        return new Promise((resolve, reject) => {
            conexion.query(`select * from activity where name = '`+name+`'`,
                (err, resultados) => {
                    if (err) {console.log('err')}
                    else {resolve(resultados); console.log(resultados.rows)}
                });
        });
    }
}