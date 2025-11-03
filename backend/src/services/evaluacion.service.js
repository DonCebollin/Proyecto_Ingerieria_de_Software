"use strict";

import EvaluacionPractica from "../entity/evaluacion.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function crearEvaluacionService(data) {
  try {
    const repo = AppDataSource.getRepository("EvaluacionPractica");
    const evaluacionExistente = await repo.findOne({
      where: {
        id_practica: data.id_practica,
        id_usuario: data.id_usuario,
      },
    });
    if (evaluacionExistente) {
      Object.assign(evaluacionExistente, {
        nota: data.nota,
        comentario: data.comentario,
        fecha_registro: new Date(),
      });
      await repo.save(evaluacionExistente);
      return [evaluacionExistente, null];
    }

    const nuevaEvaluacion = repo.create(data);
    await repo.save(nuevaEvaluacion);

    return [nuevaEvaluacion, null];
  } catch (error) {
    console.error("Error al registrar evaluación:", error);
    return [null, "Error al guardar la evaluación en la base de datos"];
  }
}

export async function getEvaluacionesByPracticaService(id_practica) {
  try {
    const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
    const evaluaciones = await evaluacionRepository.find({
      where: { id_practica },
    });
    if (!evaluaciones || evaluaciones.length === 0)
      return [[], "No hay evaluaciones registradas para esta práctica"];
    return [evaluaciones, null];
  } catch (error) {
    console.error("Error al obtener evaluaciones:", error);
    return [null, "Error al consultar las evaluaciones"];
  }
}

export async function getEvaluacionByIdService(id_evaluacion) {
  try {
    const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
    const evaluacion = await evaluacionRepository.findOne({
      where: { id_evaluacion },
    });
    if (!evaluacion) return [null, "Evaluación no encontrada"];
    return [evaluacion, null];
  } catch (error) {
    console.error("Error al obtener evaluación:", error);
    return [null, "Error al consultar la evaluación"];
  }
}

export async function updateEvaluacionService(id_evaluacion, data) {
  try {
    const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
    const evaluacion = await evaluacionRepository.findOne({
      where: { id_evaluacion },
    });
    if (!evaluacion) return [null, "Evaluación no encontrada"];
    Object.assign(evaluacion, data);
    await evaluacionRepository.save(evaluacion);

    return [evaluacion, null];
  } catch (error) {
    console.error("Error al actualizar evaluación:", error);
    return [null, "Error al modificar la evaluación"];
  }
}

export async function deleteEvaluacionService(id_evaluacion) {
  try {
    const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
    const evaluacion = await evaluacionRepository.findOne({
      where: { id_evaluacion },
    });
    if (!evaluacion) return [null, "Evaluación no encontrada"];
    await evaluacionRepository.remove(evaluacion);
    return [evaluacion, null];
  } catch (error) {
    console.error("Error al eliminar evaluación:", error);
    return [null, "Error al eliminar la evaluación"];
  }
}

export async function getEvaluacionesByDocenteService(id_usuario) {
  try {
    const repo = AppDataSource.getRepository("EvaluacionPractica");
    const evaluaciones = await repo.find({
      where: { id_usuario },
      relations: ["practica"],
      order: { fecha_registro: "DESC" },
    });

    if (!evaluaciones || evaluaciones.length === 0)
      return [[], "No hay evaluaciones registradas por este docente"];

    return [evaluaciones, null];
  } catch (error) {
    return [null, error.message];
  }
}
