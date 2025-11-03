"use strict";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configurar directorio de subida
const uploadPath = path.resolve("uploads/documentos");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Tamaño máximo del archivo (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext)
            .replace(/[^\w\-]+/g, "_")
            .toLowerCase();
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${base}-${unique}${ext}`);
    }
});

// Filtro de archivos
function fileFilter(req, file, cb) {
    // Verificar tipo MIME
    const mimeTypes = [
        // PDF
        "application/pdf",
        // DOCX
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        // ZIP
        "application/zip",
        "application/x-zip-compressed",
        "multipart/x-zip",
        // RAR
        "application/x-rar-compressed",
        "application/vnd.rar",
        "application/rar",
        // Fallback común
        "application/octet-stream"
    ];

    if (!mimeTypes.includes(file.mimetype)) {
        req.fileValidationError = "Solo se permiten archivos PDF, DOCX, ZIP o RAR";
        return cb(null, false);
    }

    // Verificar extensión
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".pdf", ".docx", ".doc", ".zip", ".rar"].includes(ext)) {
        req.fileValidationError = "Solo se permiten archivos PDF, DOCX, ZIP o RAR";
        return cb(null, false);
    }

    // Verificar nombre del archivo
    const nombre = file.originalname.toLowerCase();
    if (!nombre.includes("informe") && !nombre.includes("autoevaluacion")) {
        req.fileValidationError = "El nombre del archivo debe contener 'informe' o 'autoevaluacion'";
        return cb(null, false);
    }

    cb(null, true);
}

// Configuración de multer
const uploadDoc = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1
    }
});

export default uploadDoc;