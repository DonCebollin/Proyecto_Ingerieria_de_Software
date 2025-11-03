"use strict";

import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.resolve("uploads/documentos");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const MAX_MB = Number(process.env.BITACORA_MAX_MB ?? 10);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^\w\-]+/g, "_");
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);
  },
});

// evita trucos tipo "documento.pdf.exe"
function hasDoubleExtension(filename) {
  const parts = filename.split(".");
  if (parts.length <= 2) return false; // p.ej. nombre.pdf
  const last = parts.pop().toLowerCase();
  const prev = parts.pop().toLowerCase();
  // si la penúltima es una “buena” extensión y la última es sospechosa -> bloquear
  const good = ["pdf", "docx"];
  const bad  = ["exe","bat","cmd","com","js","vbs","msi","scr","ps1"];
  return good.includes(prev) && bad.includes(last);
}

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const allowedExts = [".pdf", ".docx", ".zip", ".rar"];
  const allowedMimes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // ZIP
    "application/zip",
    "application/x-zip-compressed",
    "multipart/x-zip",
    // RAR
    "application/x-rar-compressed",
    "application/vnd.rar",
    "application/rar",
    // fallback común
    "application/octet-stream",
  ];

  if (hasDoubleExtension(file.originalname)) {
    return cb(new Error("Nombre de archivo inválido (doble extensión detectada)"));
  }

  if (!allowedExts.includes(ext)) {
    return cb(new Error("Solo PDF, DOCX, ZIP o RAR"));
  }

  if (!allowedMimes.includes(mime)) {
    // Permitimos octet-stream como fallback si la extensión es válida
    if (mime !== "application/octet-stream") {
      return cb(new Error("Tipo de archivo no permitido"));
    }
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_MB * 1024 * 1024, files: 1 },
}).single('archivo');

export default upload;