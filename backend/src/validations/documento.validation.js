"use strict";

import Joi from "joi";

export const documentoBodyValidation = Joi.object({
  id_practica: Joi.number().integer().required().messages({
    "any.required": "El id de la práctica es obligatorio",
    "number.base": "El id de la práctica debe ser un número",
  }),
  nombre_archivo: Joi.string().max(255).required().messages({
    "string.empty": "El nombre del archivo no puede estar vacío",
    "string.max": "El nombre del archivo no puede superar los 255 caracteres",
  }),
  ruta_archivo: Joi.string().max(500).required().messages({
    "string.empty": "La ruta del archivo no puede estar vacía",
    "string.max": "La ruta del archivo no puede superar los 500 caracteres",
  }),
  formato: Joi.string().valid("pdf", "docx").required().messages({
    "any.only": "Solo se permiten archivos en formato PDF o DOCX",
    "string.empty": "Debe especificar el formato del archivo",
  }),
  peso_mb: Joi.number().min(0.01).max(10).required().messages({
    "number.base": "El peso del archivo debe ser numérico",
    "number.min": "El peso del archivo debe ser mayor que 0 MB",
    "number.max": "El archivo no puede exceder los 10 MB",
  }),
  estado_revision: Joi.string()
    .valid("pendiente", "aprobado", "rechazado")
    .default("pendiente")
    .messages({
      "any.only": "El estado de revisión debe ser 'pendiente', 'aprobado' o 'rechazado'",
    }),
});

export const documentoEstadoValidation = Joi.object({
  estado_revision: Joi.string()
    .valid("pendiente", "aprobado", "rechazado")
    .required()
    .messages({
      "any.required": "Debe indicar el nuevo estado del documento",
      "any.only": "El estado de revisión debe ser 'pendiente', 'aprobado' o 'rechazado'",
    }),
});
