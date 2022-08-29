const conex = require("../database/db")
const conexion = require("../database/odoo")

module.exports = {
    cargardaily() {
        return new Promise((resolve, reject) => {
            conex.query(`select daily_load_finca.id, name, identity, registration_date, hour_day, state 
            from employee 
            join daily_load_finca on employee.id = daily_load_finca.employee_id 
            where state = false
            order by registration_date desc, daily_load_finca desc`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    cargaractividad() {
        return new Promise((resolve, reject) => {
            conexion.query(`select * from farm_activities`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    settings() {
        return new Promise((resolve, reject) => {
            conexion.query(`select company_id, salary_per_day/8 from farm_settings where seleccionado = true`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    cargaremployee(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select hr_employee.id, hr_employee.name as name, identification_id as identity, birthday, 
            hr_employee.department_id, hr_department.name as name_department, job_id, hr_job.name as name_job
            from hr_employee 
            join hr_department on hr_department.id = hr_employee.department_id
            join hr_job on hr_job.id = hr_employee.job_id
            where hr_employee.company_id = `+id+``,
            (err, resultados) => {
                if (err) {reject(err);}
                else {resolve(resultados); console.log("datos recuperados: "+resultados)}
            });
        });
    },
    cargaremployee() {
        return new Promise((resolve, reject) => {
            conexion.query(`select hr_employee.id, hr_employee.name as name, identification_id as identity, birthday, 
            hr_employee.department_id, hr_department.name as name_department, job_id, hr_job.name as name_job
            from hr_employee 
            join hr_department on hr_department.id = hr_employee.department_id
            join hr_job on hr_job.id = hr_employee.job_id
            where hr_employee.company_id = 4`,
            (err, resultados) => {
                if (err) {reject(err);}
                else {resolve(resultados); console.log("datos recuperados: "+resultados)}
            });
        });
    },
}