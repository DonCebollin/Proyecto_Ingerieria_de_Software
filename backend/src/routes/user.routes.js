"use strict";
import { Router } from "express";
import { isAdmin } from "../middlewares/authorization.middleware.js";
import { verificarToken } from "../middlewares/authentication.middleware.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router
  .use(verificarToken)
  .use(isAdmin);

router
  .get("/", getUsers)
  .get("/detail/", getUser)
  .patch("/detail/", updateUser)
  .delete("/detail/", deleteUser);

export default router;