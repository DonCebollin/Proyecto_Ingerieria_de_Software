"use strict";
import passport from "passport";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export function verificarToken(req, res, next) {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
            console.error("Error de autenticación:", err);
            return handleErrorServer(res, 500, "Error de autenticación en el servidor");
        }

        if (!user) {
            return handleErrorClient(
                res, 
                401, 
                "No tienes permiso para acceder a este recurso",
                { info: info ? info.message : "Token inválido o expirado" }
            );
        }

        // Agregar el usuario a la request para uso posterior
        req.user = user;
        next();
    })(req, res, next);
}