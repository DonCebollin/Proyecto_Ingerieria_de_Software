"use strict";

import { Router } from "express";
import upload from "../middlewares/uploadfile.middleware.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isDocente, isEstudiante } from "../middlewares/authorization.middleware.js";
import {
  deleteDocumento,
  getDocumentoById,
  getDocumentos,
  registrarDocumento,
  subirArchivo,
  updateEstadoDocumento,
} from "../controllers/documento.controller.js";

const router = Router();

router.use(authenticateJwt);

router.post("/subir/archivo", isEstudiante, upload.single("file"), subirArchivo);

router.post("/registrar", isEstudiante, registrarDocumento);

router.delete("/:id", isEstudiante, deleteDocumento);

router.patch("/:id/estado", isDocente, updateEstadoDocumento);

router.get("/", getDocumentos);
router.get("/:id", getDocumentoById);

export default router;
