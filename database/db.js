const { Pool } = require("pg")
// Coloca aquí tus credenciales
const pool = new Pool({
  user: 'postgres',
    host: 'localhost',
    password: '1234',
    database: 'practica',
    port: 5432,
});

pool.connect((error)=>{
    if(error){
        console.error('Error en conexion BD interna');
        return
    }else{
        console.log('Conexion exitosa con la BD interna');
    }
})

module.exports = pool;