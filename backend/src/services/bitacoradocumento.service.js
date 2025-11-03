"use strict";
import { AppDataSource } from "../config/configDb.js";

const documentoRepository = AppDataSource.getRepository("Documento");
const practicaRepository = AppDataSource.getRepository("Practica");

export async function registrarDocumento(data) {
    try {
        // Validar que todos los campos requeridos estén presentes
        const camposRequeridos = ['id_practica', 'nombre_archivo', 'ruta_archivo', 'formato', 'peso_mb'];
        const camposFaltantes = camposRequeridos.filter(campo => !data[campo]);
        
        if (camposFaltantes.length > 0) {
            return [null, `Faltan campos requeridos: ${camposFaltantes.join(', ')}`];
        }

        // Validar el formato del documento
        const formatosPermitidos = ['pdf', 'docx', 'zip', 'rar'];
        if (!formatosPermitidos.includes(data.formato.toLowerCase())) {
            return [null, `Formato no permitido. Los formatos permitidos son: ${formatosPermitidos.join(', ')}`];
        }

        // Verificar si existe la práctica
        const practica = await practicaRepository.findOne({
            where: { id_practica: data.id_practica }
        });

        if (!practica) {
            return [null, "La práctica asociada no existe"];
        }

        // Verificar estado de la práctica
        if (practica.estado !== "en_progreso") {
            return [null, "Solo se pueden registrar documentos cuando la práctica está en progreso"];
        }

        // Verificar si ya existe un documento del mismo tipo
        const nombreLower = data.nombre_archivo.toLowerCase();
        const tipoDocumento = nombreLower.includes("informe") ? "informe" : "autoevaluacion";
        
        const documentoExistente = await documentoRepository.findOne({
            where: {
                id_practica: data.id_practica,
                nombre_archivo: documentoRepository.query("LOWER(nombre_archivo) LIKE :tipo", {
                    tipo: `%${tipoDocumento}%`
                })
            }
        });

        if (documentoExistente) {
            return [null, `Ya existe un documento de tipo ${tipoDocumento} para esta práctica`];
        }

        // Crear y guardar el documento
        const documentoData = {
            ...data,
            estado_revision: "pendiente",
            fecha_subida: new Date()
        };

        try {
            const nuevoDocumento = documentoRepository.create(documentoData);
            const documentoGuardado = await documentoRepository.save(nuevoDocumento);
            return [documentoGuardado, null];
        } catch (dbError) {
            console.error("Error específico de base de datos:", dbError);
            
            if (dbError.code === '23505') {  // Error de duplicación
                return [null, "Ya existe un documento con el mismo nombre"];
            } else if (dbError.code === '23503') {  // Error de clave foránea
                return [null, "La práctica asociada no es válida"];
            } else if (dbError.code === '23502') {  // Error de no nulo
                return [null, "Falta un campo requerido en la base de datos"];
            }
            
            throw dbError; // Re-lanzar el error si no es uno de los casos manejados
        }
    } catch (error) {
        console.error("Error al registrar documento:", error);
        return [null, `Error al guardar el documento: ${error.message}`];
    }
}

export async function obtenerDocumentosPorPractica(id_practica) {
    try {
        return await documentoRepository.find({
            where: { id_practica: parseInt(id_practica) },
            order: { fecha_subida: "DESC" }
        });
    } catch (error) {
        throw new Error("Error al obtener documentos de la práctica");
    }
}

export async function actualizarEstadoDocumento(id_documento, estado_revision) {
    try {
        await documentoRepository.update(id_documento, { estado_revision });
        return await documentoRepository.findOne({
            where: { id_documento: parseInt(id_documento) }
        });
    } catch (error) {
        throw new Error("Error al actualizar el estado del documento");
    }
}