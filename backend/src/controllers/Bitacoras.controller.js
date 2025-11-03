"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import * as bitacoraService from "../services/Bitacoras.service.js";

export async function registrarBitacora(req, res) {
    try {
        const { 
            id_practica, 
            semana, 
            descripcion_actividades, 
            resultados_aprendizajes,
            horas_trabajadas 
        } = req.body;
        
        // Validar archivo si se proporcionó
        if (req.fileValidationError) {
            return handleErrorClient(res, 400, req.fileValidationError);
        }

        const archivo = req.file;

        // Validar campos requeridos
        if (!id_practica || !semana || !descripcion_actividades || !resultados_aprendizajes || !horas_trabajadas) {
            return handleErrorClient(res, 400, "Todos los campos son requeridos");
        }

        // Verificar la práctica activa
        const practicaActiva = await bitacoraService.verificarPracticaActiva(id_practica);
        if (!practicaActiva) {
            return handleErrorClient(res, 400, "No existe una práctica activa para registrar la bitácora");
        }

        // Validar la semana actual
        const fechaActual = new Date();
        const inicioAno = new Date(fechaActual.getFullYear(), 0, 1);
        const semanaActual = Math.ceil(((fechaActual - inicioAno) / 86400000 + inicioAno.getDay() + 1) / 7);
        
        if (semanaActual - semana > 1) {
            return handleErrorClient(res, 400, `La semana ${semana} ya no está disponible para registro. Semana actual: ${semanaActual}`);
        }
        if (semana > semanaActual) {
            return handleErrorClient(res, 400, "No se puede registrar bitácoras de semanas futuras");
        }

        // Validar secuencia de semanas
        const ultimaSemana = await bitacoraService.obtenerUltimaSemana(id_practica);
        if (semana <= ultimaSemana) {
            return handleErrorClient(res, 400, "Ya existe una bitácora para esta semana");
        }
        if (semana > ultimaSemana + 1) {
            return handleErrorClient(res, 400, "Debe registrar las bitácoras en orden secuencial");
        }

        // Validar y convertir horas trabajadas
        const horasNum = parseFloat(horas_trabajadas);
        if (isNaN(horasNum) || horasNum < 1 || horasNum > 40) {
            return handleErrorClient(res, 400, "Las horas trabajadas deben estar entre 1 y 40");
        }
        if (horasNum % 0.5 !== 0) {
            return handleErrorClient(res, 400, "Las horas deben registrarse en intervalos de media hora");
        }

        // Validar contenido de textos
        if (descripcion_actividades.replace(/\s+/g, '').length < 50) {
            return handleErrorClient(res, 400, "La descripción de actividades debe tener contenido significativo (mínimo 100 caracteres)");
        }

        if (resultados_aprendizajes.replace(/\s+/g, '').length < 25) {
            return handleErrorClient(res, 400, "Los resultados de aprendizaje deben tener contenido significativo (mínimo 50 caracteres)");
        }

        // Preparar datos de la bitácora
        let datosBitacora = {
            id_practica: parseInt(id_practica),
            semana: parseInt(semana),
            descripcion_actividades: descripcion_actividades.trim(),
            resultados_aprendizajes: resultados_aprendizajes.trim(),
            horas_trabajadas: horasNum,
            estado_revision: "en_progreso",
            fecha_registro: new Date()
        };

        // Agregar información del archivo si se proporcionó
        if (archivo) {
            datosBitacora = {
                ...datosBitacora,
                nombre_archivo: archivo.filename,
                ruta_archivo: archivo.path,
                formato_archivo: archivo.mimetype.includes("pdf") ? "pdf" : 
                               archivo.mimetype.includes("rar") ? "rar" : "docx",
                peso_archivo_mb: parseFloat((archivo.size / (1024 * 1024)).toFixed(2))
            };
        }

        // Registrar la bitácora
        const nuevaBitacora = await bitacoraService.crearBitacora(datosBitacora);
        return handleSuccess(res, 201, "Bitácora registrada exitosamente", nuevaBitacora);
    } catch (error) {
        console.error("Error al registrar bitácora:", error);
        if (error.code === "LIMIT_FILE_SIZE") {
            return handleErrorClient(res, 400, "El archivo excede el tamaño máximo permitido");
        }
        return handleErrorServer(res, 500, error.message);
    }
}

export async function obtenerBitacora(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return handleErrorClient(res, 400, "El ID de la bitácora es requerido");
        }

        const bitacora = await bitacoraService.obtenerBitacora(id);
        if (!bitacora) {
            return handleErrorClient(res, 404, "Bitácora no encontrada");
        }

        return handleSuccess(res, 200, "Bitácora encontrada exitosamente", bitacora);
    } catch (error) {
        console.error("Error al obtener bitácora:", error);
        return handleErrorServer(res, 500, error.message);
    }
}

export async function obtenerBitacorasPorPractica(req, res) {
    try {
        const { id_practica } = req.params;
        if (!id_practica) {
            return handleErrorClient(res, 400, "El ID de la práctica es requerido");
        }

        const bitacoras = await bitacoraService.obtenerBitacorasPorPractica(id_practica);
        if (!bitacoras || bitacoras.length === 0) {
            return handleSuccess(res, 200, "No se encontraron bitácoras para esta práctica", []);
        }

        return handleSuccess(res, 200, "Bitácoras recuperadas exitosamente", bitacoras);
    } catch (error) {
        console.error("Error al obtener bitácoras:", error);
        return handleErrorServer(res, 500, error.message);
    }
}

export async function obtenerUltimaSemana(req, res) {
    try {
        const { id_practica } = req.params;
        if (!id_practica) {
            return handleErrorClient(res, 400, "El ID de la práctica es requerido");
        }

        const ultimaSemana = await bitacoraService.obtenerUltimaSemana(id_practica);
        return handleSuccess(res, 200, "Última semana recuperada exitosamente", { ultimaSemana: ultimaSemana || 0 });
    } catch (error) {
        console.error("Error al obtener última semana:", error);
        return handleErrorServer(res, 500, error.message);
    }
}
