"use strict";

import fs from "fs";
import {
  deleteDocumentoService,
  getDocumentoByIdService,
  getDocumentosService,
  registrarDocumentoService,
  updateEstadoDocumentoService,
} from "../services/documento.service.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";
import {
  documentoBodyValidation,
  documentoEstadoValidation,
} from "../validations/documento.validation.js";

export async function subirArchivo(req, res) {
  try {
    if (req.fileValidationError) {
      return handleErrorClient(res, 400, req.fileValidationError);
    }

    if (!req.file) {
      return handleErrorClient(res, 400, "No se ha subido ningún archivo");
    }

    const { filename, path: filePath, size, mimetype } = req.file;

    const archivoData = {
      nombre_archivo: filename,
      ruta_archivo: filePath,
      formato: mimetype.includes("pdf") ? "pdf" : "docx",
      peso_mb: parseFloat((size / (1024 * 1024)).toFixed(2)),
    };

    handleSuccess(res, 201, "Archivo subido correctamente", archivoData);
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return handleErrorClient(res, 400, "El archivo excede los 10 MB permitidos");
    }

    console.error("Error al subir archivo:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function registrarDocumento(req, res) {
  try {
    const { id_practica, nombre_archivo, ruta_archivo, formato, peso_mb } = req.body;

    const { error } = documentoBodyValidation.validate({
      id_practica,
      nombre_archivo,
      ruta_archivo,
      formato,
      peso_mb,
    });

    if (error) return handleErrorClient(res, 400, error.message);

    const [documento, errorDoc] = await registrarDocumentoService({
      id_practica,
      nombre_archivo,
      ruta_archivo,
      formato,
      peso_mb,
    });

    if (errorDoc) return handleErrorClient(res, 400, errorDoc);

    handleSuccess(res, 201, "Documento registrado correctamente", documento);
  } catch (error) {
    console.error("Error al registrar documento:", error);
    handleErrorServer(res, 500, error.message);
  }
}

export async function getDocumentos(req, res) {
  try {
    const [documentos, errorDocs] = await getDocumentosService();
    if (errorDocs) return handleErrorClient(res, 404, errorDocs);

    if (documentos.length === 0) {
      return handleSuccess(res, 204, "No hay documentos registrados", []);
    }

    handleSuccess(res, 200, "Documentos encontrados", documentos);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

// 🔍 Obtener un documento por su ID
export async function getDocumentoById(req, res) {
  try {
    const { id } = req.params;
    const [documento, errorDoc] = await getDocumentoByIdService(id);

    if (errorDoc) return handleErrorClient(res, 404, errorDoc);
    handleSuccess(res, 200, "Documento encontrado", documento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteDocumento(req, res) {
  try {
    const { id } = req.params;
    const [documento, errorDoc] = await deleteDocumentoService(id);
    if (errorDoc) return handleErrorClient(res, 404, errorDoc);

    if (fs.existsSync(documento.ruta_archivo)) {
      fs.unlinkSync(documento.ruta_archivo);
    }

    handleSuccess(res, 200, "Documento eliminado correctamente", documento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateEstadoDocumento(req, res) {
  try {
    const { id } = req.params;
    const { estado_revision } = req.body;

    const { error } = documentoEstadoValidation.validate({ estado_revision });
    if (error) return handleErrorClient(res, 400, error.message);

    const [documento, errorDoc] = await updateEstadoDocumentoService(id, estado_revision);
    if (errorDoc) return handleErrorClient(res, 404, errorDoc);

    handleSuccess(res, 200, "Estado del documento actualizado", documento);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
