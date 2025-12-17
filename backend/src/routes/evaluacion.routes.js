"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isDocente, isDocenteOrEstudiante, isEstudiante } from "../middlewares/authorization.middleware.js";

import {
  crearEvaluacion,
  getEvaluacionByDocumento,
  getEvaluacionesByDocente,
  updateEvaluacion,
} from "../controllers/evaluacion.controller.js";

const router = Router();

router
  .use(authenticateJwt)

router.post("/",authenticateJwt, isDocenteOrEstudiante, crearEvaluacion);
router.get("/documento/:id_documento",authenticateJwt, isDocenteOrEstudiante, getEvaluacionByDocumento);
router.get("/docente",authenticateJwt, isDocente, getEvaluacionesByDocente);
router.patch("/:id",authenticateJwt, isDocente, updateEvaluacion);

export default router;
