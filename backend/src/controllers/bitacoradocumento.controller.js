"use strict";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";
import * as documentoService from "../services/bitacoradocumento.service.js";

export async function subirArchivo(req, res) {
    try {
        // Validar si hay errores de validación del archivo
        if (req.fileValidationError) {
            return handleErrorClient(res, 400, req.fileValidationError);
        }

        if (!req.file) {
            return handleErrorClient(res, 400, "No se ha subido ningún archivo");
        }

        const { filename, path: filePath, size, mimetype } = req.file;

        // Determinar el formato del archivo
        let formato;
        if (mimetype.includes("pdf")) {
            formato = "pdf";
        } else if (mimetype.includes("docx") || mimetype.includes("msword")) {
            formato = "docx";
        } else if (mimetype.includes("zip") || mimetype.includes("x-zip")) {
            formato = "zip";
        } else if (mimetype.includes("rar")) {
            formato = "rar";
        } else {
            return handleErrorClient(res, 400, "El archivo debe ser PDF, DOCX, ZIP o RAR");
        }

        // Validar el tamaño del archivo (10MB máximo)
        const pesoMb = parseFloat((size / (1024 * 1024)).toFixed(2));
        if (pesoMb > 10) {
            return handleErrorClient(res, 400, "El archivo excede los 10 MB permitidos");
        }

        const archivoData = {
            nombre_archivo: filename,
            ruta_archivo: filePath,
            formato: formato,
            peso_mb: pesoMb
        };

        return handleSuccess(res, 201, "Archivo subido correctamente", archivoData);
    } catch (error) {
        console.error("Error al subir archivo:", error);
        if (error.code === "LIMIT_FILE_SIZE") {
            return handleErrorClient(res, 400, "El archivo excede los 10 MB permitidos");
        }
        return handleErrorServer(res, 500, "Error al procesar el archivo");
    }
}

export async function registrarDocumento(req, res) {
    try {
        const { id_practica, nombre_archivo, ruta_archivo, formato, peso_mb } = req.body;

        // Validar campos requeridos
        if (!id_practica || !nombre_archivo || !ruta_archivo || !formato || !peso_mb) {
            return handleErrorClient(res, 400, "Todos los campos son requeridos");
        }

        // Validar formato de archivo
        if (!["pdf", "docx", "zip", "rar"].includes(formato)) {
            return handleErrorClient(res, 400, "Formato de archivo inválido. Solo se permiten PDF, DOCX, ZIP o RAR");
        }

        // Validar el nombre del archivo para tipo de documento
        const nombreLower = nombre_archivo.toLowerCase();
        if (!nombreLower.includes("informe") && !nombreLower.includes("autoevaluacion")) {
            return handleErrorClient(res, 400, "Solo se aceptan el informe final o la autoevaluación");
        }

        // Registrar el documento
        const documentoData = {
            id_practica: parseInt(id_practica),
            nombre_archivo,
            ruta_archivo,
            formato,
            peso_mb: parseFloat(peso_mb),
            estado_revision: "pendiente",
            fecha_subida: new Date()
        };

        const [documento, error] = await documentoService.registrarDocumento(documentoData);
        
        if (error) {
            return handleErrorClient(res, 400, error);
        }

        return handleSuccess(res, 201, "Documento registrado correctamente", documento);
    } catch (error) {
        console.error("Error al registrar documento:", error);
        return handleErrorServer(res, 500, "Error al registrar el documento");
    }
}

export async function obtenerDocumentosPractica(req, res) {
    try {
        const { id_practica } = req.params;

        if (!id_practica) {
            return handleErrorClient(res, 400, "ID de práctica requerido");
        }

        const documentos = await documentoService.obtenerDocumentosPorPractica(id_practica);
        return handleSuccess(res, 200, "Documentos recuperados exitosamente", documentos);
    } catch (error) {
        console.error("Error al obtener documentos:", error);
        return handleErrorServer(res, 500, "Error al recuperar los documentos");
    }
}

export async function actualizarEstadoDocumento(req, res) {
    try {
        const { id_documento } = req.params;
        const { estado_revision } = req.body;

        if (!id_documento || !estado_revision) {
            return handleErrorClient(res, 400, "ID de documento y estado de revisión son requeridos");
        }

        if (!["pendiente", "aprobado", "rechazado"].includes(estado_revision)) {
            return handleErrorClient(res, 400, "Estado de revisión inválido");
        }

        const documento = await documentoService.actualizarEstadoDocumento(id_documento, estado_revision);
        return handleSuccess(res, 200, "Estado del documento actualizado", documento);
    } catch (error) {
        console.error("Error al actualizar estado del documento:", error);
        return handleErrorServer(res, 500, "Error al actualizar el estado del documento");
    }
}