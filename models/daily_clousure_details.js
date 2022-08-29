const conexion = require("../database/db")
const conex = require("../database/odoo")

module.exports = {
    insertar(amount, day_hours, overtime, production_payment, hourly_pay, extra_payment,daily_closure_finca_id, employee_id) {
        return new Promise((resolve, reject) => {
            conexion.query(`insert into daily_closure_finca_detail
            (amounts, day_hours, overtime, production_payment, hourly_pay, extra_payment, daily_closure_finca_id, employee_id)
            values
            ($1,$2,$3,$4,$5,$6,$7,$8)`,
                [amount, day_hours, overtime, production_payment, hourly_pay, extra_payment,daily_closure_finca_id, employee_id], (err, resultados) => {
                    if (err){ 
                        reject(err); 
                        console.log(err);
                    }else {resolve(resultados.insertId)};
                });
        });
    },
    obtenerfecha(fecha) {
        return new Promise((resolve, reject) => {
            console.log('entrada a la funcion');
            conexion.query(`select * from daily_closure_finca_detail 
            join employee on employee.id = daily_closure_finca_detail.employee_id
            where daily_closure_finca_id = `+fecha+``,
                (err, resultados) => {
                    if (err){ reject(err); console.log(err)}
                    else{ resolve(resultados);}
                });
        });
    },
    
}