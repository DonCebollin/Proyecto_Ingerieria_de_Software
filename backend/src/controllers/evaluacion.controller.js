"use strict";

import {
  crearEvaluacionService,
  deleteEvaluacionService,
  getEvaluacionByIdService,
  getEvaluacionesByDocenteService,
  getEvaluacionesByPracticaService,
  updateEvaluacionService,
} from "../services/evaluacion.service.js";

import {
  evaluacionBodyValidation,
  evaluacionUpdateValidation,
} from "../validations/evaluacion.validation.js";

import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function crearEvaluacion(req, res) {
  try {

    const id_usuario = req.user.id_usuario || req.user.id || req.user.userId;
    const rol_usuario = "docente";

    if (!id_usuario) {
      return handleErrorClient(res, 400, "No se pudo obtener el ID del usuario autenticado");
    }

    const { error } = evaluacionBodyValidation.validate(req.body);
    if (error) return handleErrorClient(res, 400, error.message);

    const evaluacionData = {
      ...req.body,
      id_usuario,
      rol_usuario,
    };

    console.log("Datos recibidos para guardar evaluación:", evaluacionData);

    const [evaluacion, errorEval] = await crearEvaluacionService(evaluacionData);
    if (errorEval) return handleErrorClient(res, 500, errorEval);

    handleSuccess(res, 201, "Evaluación registrada correctamente", evaluacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}


export async function getEvaluacionesByPractica(req, res) {
  try {
    const { id_practica } = req.params;

    const [evaluaciones, errorEval] = await getEvaluacionesByPracticaService(id_practica);
    if (errorEval && evaluaciones.length === 0)
      return handleErrorClient(res, 404, errorEval);

    handleSuccess(res, 200, "Evaluaciones encontradas", evaluaciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getEvaluacionById(req, res) {
  try {
    const { id } = req.params;

    const [evaluacion, errorEval] = await getEvaluacionByIdService(id);
    if (errorEval) return handleErrorClient(res, 404, errorEval);

    handleSuccess(res, 200, "Evaluación encontrada", evaluacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function updateEvaluacion(req, res) {
  try {
    const { id } = req.params;
    const { error } = evaluacionUpdateValidation.validate(req.body);

    if (error) return handleErrorClient(res, 400, error.message);

    const [evaluacion, errorEval] = await updateEvaluacionService(id, req.body);
    if (errorEval) return handleErrorClient(res, 404, errorEval);

    handleSuccess(res, 200, "Evaluación actualizada correctamente", evaluacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function deleteEvaluacion(req, res) {
  try {
    const { id } = req.params;

    const [evaluacion, errorEval] = await deleteEvaluacionService(id);
    if (errorEval) return handleErrorClient(res, 404, errorEval);

    handleSuccess(res, 200, "Evaluación eliminada correctamente", evaluacion);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}

export async function getEvaluacionesByDocente(req, res) {
  try {
    const id_usuario = req.user.id_usuario || req.user.id || req.user.userId;

    if (!id_usuario)
      return handleErrorClient(res, 400, "No se pudo obtener el ID del docente autenticado");

    const [evaluaciones, errorEval] = await getEvaluacionesByDocenteService(id_usuario);
    if (errorEval && evaluaciones.length === 0)
      return handleErrorClient(res, 404, errorEval);

    handleSuccess(res, 200, "Evaluaciones del docente encontradas", evaluaciones);
  } catch (error) {
    handleErrorServer(res, 500, error.message);
  }
}
