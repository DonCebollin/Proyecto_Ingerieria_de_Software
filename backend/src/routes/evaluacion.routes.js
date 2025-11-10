"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isDocente , isEstudiante } from "../middlewares/authorization.middleware.js";

import {
  crearEvaluacion,
  deleteEvaluacion,
  getEvaluacionById,
  getEvaluacionesByDocente,
  getEvaluacionesByDocumento,
  updateEvaluacion,
} from "../controllers/evaluacion.controller.js";

const router = Router();

const isDocenteOrEstudiante = async (req, res, next) => {
  await isDocente(req, res, (err) => {
    if (!err) return next();
    isEstudiante(req, res, next);
  });
};

router
  .use(authenticateJwt)
  .use(isDocente);

router.post("/", isDocente, crearEvaluacion);

router.get("/documento/:id_documento", isDocenteOrEstudiante, getEvaluacionesByDocumento);
router.get("/:id", isDocenteOrEstudiante, getEvaluacionById);

router.get("/docente", isDocente, getEvaluacionesByDocente);
router.patch("/:id", isDocente, updateEvaluacion);
router.delete("/:id", isDocente, deleteEvaluacion);

export default router;
