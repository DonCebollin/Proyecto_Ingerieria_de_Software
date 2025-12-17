"use strict";
import { Router } from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import documentoRoutes from "./documento.routes.js";
import evaluacionRoutes from "./evaluacion.routes.js";

const router = Router();

router
  .use("/auth", authRoutes)
  .use("/user", userRoutes)
  .use("/documentos", documentoRoutes)
  .use("/evaluaciones", evaluacionRoutes)

export default router;
