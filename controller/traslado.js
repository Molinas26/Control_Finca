const conexion = require("../database/db")
exports.save = (req,res)=>{

    function sumarDias(fecha){
        fecha.setDate(fecha.getDate());
        return fecha;
    }

    var d = new Date();
    var date = sumarDias(d)
    var a = date.getFullYear() + '-'+ (date.getMonth() + 1) + '-' +  date.getDate()

    const area = req.body.area;
    const subarea = req.body.subarea;
    const hora = req.body.hora;
    const justificacion = req.body.justificacion;
    const empleado = req.body.empleado;

    conexion.query("insert into programacions(id_subarea, id_empleado, fecha)values($1, $2, $3)",[subarea,empleado,a], (error, results)=>{
        if (error) {
            console.log(error);
        }else{
            console.log("Agregado exitosamente: ("+subarea+'-'+emp[index]+'-'+a+")");
        }
    })

    res.redirect('/programacion');

}