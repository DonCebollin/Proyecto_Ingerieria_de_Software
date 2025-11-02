const Practica=require('../entity/practica.entity');
const {getRepository}=require('typeorm');

export async function crearPractica(datosPractica){
    const practicaRepository=getRepository(Practica);
    const nuevaPractica=practicaRepository.create({...datosPractica,fecha_creacion:new Date(),estado: 'Revision_Pendiente'});
    return await practicaRepository.save(nuevaPractica);
}

export async function obtenerPracticasEstudiante(idEstudiante){
    const practicaRepository=getRepository(Practica);
    return await practicaRepository.find({where:{estudiante:idEstudiante},
        relations:['empresa','supervisor']});
}

export async function obtenerPracticaPorId(id){
    const practicaRepository=getRepository(Practica);
    return await practicaRepository.findOne({where: {id_practica:id},
        relations:['Estudiante','Empresa','Supervisor']});
}

export async function actualizarEstadoPractica(id,estado,observaciones){
    const practicaRepository=getRepository(Practica);
    const practica=await practicaRepository.findOne({where:{id_practica:id}});
    if(!practica){
        return null;
    }

    practica.estado=estado;
    practica.observaciones=observaciones;  
    practica.fecha_actualizacion=new Date();

    return await practicaRepository.save(practica);
}

export async function actualizarPractica(id,datosActualizacion){
    const practicaRepository=getRepository(Practica);
    const practica=await practicaRepository.findOne({where:{id_practica:id}});
    if(!practica){
        return null;
    }
//validaciones
    //solo dejara actualizar ciertos campos si la practica esta en revision pendiente
    if(practica.estado==='Revision_Pendiente'){
        Object.assign(practica,{...datosActualizacion,fecha_actualizacion:new Date()});
        return await practicaRepository.save(practica);
    }
    return null;
}

//funcion para validar requisitos minimos de practica
export async function validarRequisitosPractica(datosPractica) {
    //verificacion de empresa
    if(!datosPractica.empresa){
        throw new Error('La empresa debe estar asignada en la practica');
    }    
}

//verificacion de supervisor
if (!datosPractica.supervisor){
    throw new Error('El supervisor debe estar asignado en la practica ');
}

//verificacion de periodo valido
if(!datosPractica.fecha_inicio || !datosPractica.fecha_fin){
    throw new Error('El periodo de la practica debe estar definido correctamente');
}

//verificacion de documentos
if(!datosPractica.documentos || datosPractica.documentos.length===0){
    throw new Error('Los documentos requeridos para la practica deben ser proporcionados');
}
return true;
