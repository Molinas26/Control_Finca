const conexion = require("../database/db")
exports.save = (req,res)=>{

    function sumarDias(fecha, dias){
        fecha.setDate(fecha.getDate() + dias);
        return fecha;
    }

    var d = new Date();
    var date = sumarDias(d, 1)
    var a = date.getFullYear() + '-'+ (date.getMonth() + 1) + '-' +  date.getDate()

    const area = req.body.area;
    const subarea = req.body.subarea;
    const emplea = req.body.empleados;
    let emp = emplea.split(','); 

    for (let index = 0; index < emp.length-1; index++) {
        conexion.query("insert into programacions(id_subarea, id_empleado, fecha)values($1, $2, $3)",[subarea,emp[index],a], (error, results)=>{
            if (error) {
                console.log(error);
            }else{
                console.log(results);
            }
        })
        
    }
    
    res.redirect('/programacion');

}