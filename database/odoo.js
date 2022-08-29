const { Pool } = require("pg")
// Coloca aquí tus credenciales
const pool = new Pool({
  user: 'adm-rodrice',
    host: '10.203.101.97',
    password: 'Mal2020',
    database: 'testTarifa2',
    port: 5432,
});

pool.connect((error)=>{
    if(error){
        console.error('Error en conexion BD de odoo');
        return
    }else{
        console.log('Conexion exitosa con la BD de odoo');
    }
})

module.exports = pool;