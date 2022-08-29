const conexion = require("../database/db")
const conex = require("../database/odoo")

module.exports = {
    insertar(empleado_id, registration_date, responsability) {
        return new Promise((resolve, reject) => {
            conexion.query(`insert into daily_load_finca
                (employee_id, responsability, registration_date)
                values
                (`+empleado_id+`, `+responsability+`, '`+registration_date+`') RETURNING id`, 
                (err, resultados) => {
                        if (err) {reject(err);console.log(err)}  
                        else {
                            resolve(resultados);
                        }
                });
        });
    },
    obtenerborradores() {
        return new Promise((resolve, reject) => {
            conexion.query(`select daily_load_finca.id, name,employee_id,department_id, job_id,registration_date,
            identity, registration_date, state 
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
    obtenerborrador(fecha) {
        return new Promise((resolve, reject) => {
            conexion.query(`select daily_load_finca.id, name,employee_id,department_id, job_id,registration_date,
            identity, registration_date, state 
            from employee 
            join daily_load_finca on employee.id = daily_load_finca.employee_id 
            where state = false and registration_date = '`+fecha+`'
            order by registration_date desc, daily_load_finca desc`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    insertarodoo(employee_id, department_id, job_id, registration_date, responsible_id, state) {
        return new Promise((resolve, reject) => {
            conex.query(`insert into farm_daily_load
            (employee_id, department_id, job_id, registration_date, responsible_id, state)
            values
            ($1,$2,$3,$4,$5,$6)  RETURNING id`,
                [employee_id, department_id, job_id, registration_date, responsible_id, "done"], (err, resultados) => {
                    if (err){ 
                        reject(err); 
                        console.log(err);
                        console.log("No insertados");
                    }else {resolve(resultados);console.log("insertados")};
                });
        });
    },
    obtenervalidado() {
        return new Promise((resolve, reject) => {
            conexion.query(`select daily_load_finca.id, name, identity, registration_date,  state 
            from employee 
            join daily_load_finca on employee.id = daily_load_finca.employee_id 
            where state = true
            order by registration_date desc, daily_load_finca desc`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenervalidados(fecha) {
        return new Promise((resolve, reject) => {
            conexion.query(`select daily_load_finca.id, name, identity, registration_date,  state 
            from employee 
            join daily_load_finca on employee.id = daily_load_finca.employee_id 
            where state = true and registration_date = '`+fecha+`'
            order by registration_date desc, daily_load_finca desc`,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`select daily_load_finca.*, employee.name as name, users.name as responsible from employee join daily_load_finca on employee.id = daily_load_finca.employee_id join users on users.id = daily_load_finca.responsability where daily_load_finca.id = `+id+``,
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados);
                });
        });
    },
    obtenerPorEmployee(id_employee) {
        return new Promise((resolve, reject) => {
            conexion.query(`select ROW_NUMBER() OVER() AS fila, * from daily_load_finca where employee_id = ?`,
                [id_employee],
                (err, resultados) => {
                    if (err) reject(err);
                    else resolve(resultados[0]);
                });
        });
    },
    obtenerPorDate(registration_date) {
        return new Promise((resolve, reject) => {
            conexion.query(`
            select employee_id, employee.name, COALESCE(sum(amount),0) as produccion,
            COALESCE(sum(amount*rate),0) as totalproduccion,
            sum(case when activity.dia = 'dia' then hour else 0 end) as horas, 
            sum(case when activity.dia = 'dia' then hour*rate else 0 end) as totalhoras, 
            sum(case when activity.dia = 'extra25' then hour else 0 end) as extra25,
            sum(case when activity.dia = 'extra50' then hour else 0 end) as extra50,
            sum(case when activity.dia = 'extra75' then hour else 0 end) as extra75,
            sum(case when activity.dia = 'extra100' then hour else 0 end) as extra100,
            sum(case when activity.dia <> 'dia' then hour*rate else 0 end) as totalhorasextras,
            sum(case when activity.dia <> 'produccion' then hour*rate else amount*rate end) as totalpagar
            from daily_load_finca 
            left join employee on employee.id = daily_load_finca.employee_id
            left join daily_load_finca_detail on daily_load_finca_detail.daily_load_finca_id = daily_load_finca.id
            left join activity on activity.id = daily_load_finca_detail.activity_id
            where registration_date = '`+registration_date+`'
            group by employee_id,employee.name`,
                (err, resultados) => {
                    if (err){ 
                        reject(err);    
                        console.log(err);
                    }else{ 
                        resolve(resultados);
                    }
                });
        });
    },
    actualizar(empleado_id, registration_date, responsability, id) {
        return new Promise((resolve, reject) => {
            conexion.query(`update productos
            set empleado_id = ?,
            registration_date = ?,
            responsability = ?,
            where id = ?`,
                [empleado_id, registration_date, responsability, id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    },
    cambiarestado(id) {
        return new Promise((resolve, reject) => {
            conexion.query(`update daily_load_finca
            set state = true
            where id = $1`,
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    },
    update(empleado_id, registration_date, responsability, id) {
        return new Promise((resolve, reject) => {
            conexion.query(`update daily_load_finca set
                employee_id = `+empleado_id+`, 
                responsability = `+responsability+`, 
                registration_date =  '`+registration_date+`'
                where id = `+id+`
                RETURNING id`, 
                (err, resultados) => {
                        if (err) {reject(err);console.log(err)}  
                        else {
                            resolve(resultados);
                        }
                });
        });
    },
    borrarodoo(fecha) {
        return new Promise((resolve, reject) => {
            conex.query(`delete from farm_daily_load
                where registration_date = '`+fecha+`'
                RETURNING id`, 
                (err, resultados) => {
                        if (err) {reject(err);console.log(err)}  
                        else {
                            resolve(resultados);
                        }
                });
        });
    },
    estadocambiar(fecha) {
        return new Promise((resolve, reject) => {
            conexion.query(`update daily_load_finca 
            set state = false
            where registration_date = '`+fecha+`'`,
                (err) => {
                    if (err) reject(err);
                    else resolve();
                });
        });
    },
    cierreValidado(date) {
        return new Promise((resolve, reject) => {
            conex.query(`
            select * from farm_weekly_closing where date_from <= '`+date+`' and date_to >= '`+date+`' and state = 'done'
            `,
                (err, resultados) => {
                    if (err){ 
                        reject(err);    
                        console.log(err);
                    }else{ 
                        resolve(resultados);
                    }
                });
        });
    },
    fechamayorodoo() {
        return new Promise((resolve, reject) => {
            conex.query(`SELECT COALESCE(max(farm_weekly_closing.date_to)+ INTERVAL '1 day','2022-01-01') as mayor_fecha
            FROM farm_weekly_closing
            WHERE farm_weekly_closing.state = 'draft'`,
                (err, resultados) => {
                    if (err){ reject(err); console.log(err)}
                    else {resolve(resultados);}
                });
        });
    },
}