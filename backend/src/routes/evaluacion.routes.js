"use strict";
import { Router } from "express";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";
import { isDocente } from "../middlewares/authorization.middleware.js";

import {
  crearEvaluacion,
  deleteEvaluacion,
  getEvaluacionById,
  getEvaluacionesByDocente,
  getEvaluacionesByPractica,
  updateEvaluacion,
} from "../controllers/evaluacion.controller.js";

const router = Router();

router
  .use(authenticateJwt)
  .use(isDocente);

router
  .post("/", crearEvaluacion)
  .get("/practica/:id_practica", getEvaluacionesByPractica)
  .get("/docente", getEvaluacionesByDocente)
  .get("/:id", getEvaluacionById)
  .patch("/:id", updateEvaluacion)
  .delete("/:id", deleteEvaluacion);

export default router;
