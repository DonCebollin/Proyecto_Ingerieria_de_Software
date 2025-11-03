"use strict";
import { AppDataSource } from "../config/configDb.js";

const bitacoraRepository = AppDataSource.getRepository("Bitacora");
const practicaRepository = AppDataSource.getRepository("Practica");

export async function crearBitacora(datoBitacora) {
    // Verificar si existe una práctica activa
    const practica = await practicaRepository.findOne({
        where: { id_practica: datoBitacora.id_practica, estado: "activa" }
    });

    if (!practica) {
        throw new Error("No existe una práctica activa para registrar la bitácora");
    }

    // Verificar si ya existe una bitácora para esta semana y práctica
    const bitacoraExistente = await bitacoraRepository.findOne({
        where: {
            id_practica: datoBitacora.id_practica,
            semana: datoBitacora.semana
        }
    });

    if (bitacoraExistente) {
        throw new Error("Ya existe una bitácora registrada para esta semana");
    }

    // Crear la nueva bitácora
    const nuevaBitacora = bitacoraRepository.create(datoBitacora);
    return await bitacoraRepository.save(nuevaBitacora);
}

export async function obtenerBitacora(id_bitacora) {
    const bitacora = await bitacoraRepository.findOne({
        where: { id_bitacora: id_bitacora }
    });

    if (!bitacora) {
        throw new Error("Bitácora no encontrada");
    }

    return bitacora;
}

export async function obtenerBitacorasPorPractica(id_practica) {
    return await bitacoraRepository.find({
        where: { id_practica: id_practica },
        order: { semana: "ASC" }
    });
}

export async function obtenerUltimaSemana(id_practica) {
    const resultado = await bitacoraRepository.findOne({
        where: { id_practica: id_practica },
        order: { semana: "DESC" }
    });

    return resultado ? resultado.semana : 0;
}