"use strict";
import { Router } from "express";
import { isAdmin, isDocente, isEstudiante } from "../middlewares/authorization.middleware.js";

import {
    createComentario,
    deleteComentario,
    getAllComentarios,
    getComentarioById,
    getComentarios,
    getComentariosByUsuarioId,
    updateComentario,
} from "../controllers/comentario.controller.js";

const router = Router();

router
    .post("/", { isEstudiante, isDocente }, createComentario)
    .get("/", { isEstudiante, isDocente }, getComentarios)
    .get("/todos",  isDocente , getAllComentarios)
    .get("/usuario/:usuarioId", isEstudiante , getComentariosByUsuarioId)
    .get("/:id", { isEstudiante, isDocente }, getComentarioById)
    .put("/:id", { isEstudiante, isDocente }, updateComentario)
    .delete("/:id", isEstudiante, deleteComentario)
    
export default router;