const conexion = require("../database/db")
const conexion2 = require("../database/odoo")

module.exports = {
    insertar(id, name, identity, birthday, department_id, name_department, job_id, name_job) {
        return new Promise((resolve, reject) => {
            conexion.query(`insert into employee
            (id, name, identity, birthday, department_id, name_department, job_id, name_job)
            values
            ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [id, name, identity, birthday, department_id, name_department, job_id, name_job], (err, resultados) => {
                    if (err){ 
                        reject(err); 
                        console.log(err);
                    }else {resolve(resultados.insertId)};
                });
        });
    },
    update(id, name, identity, birthday, department_id, name_department, job_id, name_job) {
        return new Promise((resolve, reject) => {
            conexion.query(`update employee set
            name = $2, identity = $3, birthday = $4, department_id = $5, name_department=$6, job_id=$7, name_job=$8  where id = $1`,
                [id, name, identity, birthday, department_id, name_department, job_id, name_job], (err, resultados) => {
                    if (err){ 
                        reject(err); 
                        console.log(err);
                    }else {resolve(resultados.insertId)};
                });
        });
    },

    obtener() {
        return new Promise((resolve, reject) => {
            conexion.query(`select ROW_NUMBER() OVER() AS fila, * from employee`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
  /*  
    obtener() {
        return new Promise((resolve, reject) => {
            conexion2.query(`select ROW_NUMBER() OVER() AS fila, id, name, identification_id as identity, birthday from hr_employee where company_id = 5`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    */
    obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select ROW_NUMBER() OVER() AS fila,* from employee where id = `+id+``,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenerPorEmployee(name) {
        return new Promise((resolve, reject) => {
            conexion.query(`select  * from employee where name = '`+name+`'`,
                (err, resultados) => {
                    if (err) {reject(err);}
                    else{ resolve(resultados); console.log(resultados.rows[0].id)}
                });
        });
    }
}