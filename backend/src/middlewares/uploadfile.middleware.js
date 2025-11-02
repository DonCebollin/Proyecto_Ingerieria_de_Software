"use strict";

import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = path.resolve("uploads/documentos");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

function fileFilter(req, file, cb) {
  const allowedFormats = [".pdf", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedFormats.includes(ext)) {
    return cb(new Error("Solo se permiten archivos PDF o DOCX"));
  }
  cb(null, true);
}

const limits = { fileSize: 10 * 1024 * 1024 };

const upload = multer({ storage, fileFilter, limits });

export default upload;
