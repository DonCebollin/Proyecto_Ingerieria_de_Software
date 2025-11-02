const practicaService=require('../services/practica.service');
const {success,error}=require('../handlers/responseHandlers');

//crear solicitud de practica
const practicaController={
    crearPractica:async(req,res)=>{
        try{
            const datosPractica={
                ...req.body,
                estudiante:req.user.id,
                estado:'Revision_Pendiente'
            };
            const result=await practicaService.crearPractica(datosPractica);
            return handleSuccess(res,201,'Solicitud de practica creada con exito',result);
        }catch(err){
            return error(res,500,'Error al obtener las practicas',err);
        }
},
//obtener todas las practicas (encargado)
obtenerTodasPracticas:async(req,res)=>{
    try{
        const practicas=await practicaService.obtenerTodasPracticas();
        return handleSuccess(res,200,'Practicas conseguidas con exito',practicas);
    }catch(err){
        return error(res,500,'Error al conseguir las practicas',err);
    }
},

//obtener practica de un estudiante
obtenerPracticasEstudiante:async(req,res)=>{
    try{
        const practicas=await practicaService.obtenerPracticasEstudiante(req.user.id);
        return handleSuccess(res,200,'Practicas del estudiantes conseguidas con exito',practicas);
        }catch(error){
            return error(res,500,'Error al obtener las practicas del estudiante',err);
        }
    },

//Obtener una practica especifica por ID
obtenerPracticaPorId:async(req,res)=>{
    try{
        const practica=await practicaService.obtenerPracticaPorId(req.params.id);
        if(!practica){
            return error(res,404,'Practica no encontrada/existente')
        }
        return success(res,200,'Practica recuperada con exito',practica);
    }catch (err){
        return error (res,500,'Error al obtener la practica solicitada',err);
    }
},

//actualizar estado de la practica (encargado)
actualizarEstadoPractica:async(req,res)=>{
    try{
        const {id}=req.params;
        const {estado,observaciones}=req.body;
        const practica=await practicaService.actualizarEstadoPractica(id,estado,observaciones);
        if(!practica){
            return error(res,404,'Practica no encontrada/existente');
        }
        return success(res,200,'Estado de la practica actualizado con exito',practica);
    }catch(err){
        return error(res,500,'Errorr al actualizar el estado de la practica',err);
    }
},

//actualizar informacion de practica (estudiante)
actualizarPractica:async(req,res)=>{
    try{
        const{id}=req.params;
        const datosActualizacion=req.body;
        const practica=await practicaService.actualizarPractica(id,datosActualizacion);
    if(!practica){
        return error(res,404,'Practica no econtrada/existente');
    }return success(res,200,'Practica actualizada con exito',practica);
    }catch(err){
        return error(res,500,'Error al actualizar la practica',err);
    }
}
}