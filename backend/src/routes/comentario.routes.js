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
    .post("/", createComentario)
    .get("/", getComentarios)
    .get("/todos", getAllComentarios)
    .get("/usuario/:usuarioId", getComentariosByUsuarioId)
    .get("/:id", getComentarioById)
    .put("/:id", updateComentario)
    .delete("/:id", deleteComentario)
    
export default router;