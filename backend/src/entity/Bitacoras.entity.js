"use strict";
import { EntitySchema } from "typeorm";

const BitacoraSchema = new EntitySchema({
  name: "Bitacora",
  tableName: "bitacoras",
  columns: {
    id_bitacora: {
      type: "int",
      primary: true,
      generated: true,
    },

    id_practica: {
      type: "int",
      nullable: false,
    },

    semana: {
      type: "int",
      nullable: false,
    },

    descripcion_actividades: {
      type: "text",
      nullable: false,
    },

    resultados_aprendizajes: {
      type: "text",
      nullable: false,
    },

    nombre_archivobitaora: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    ruta_archivobitacora: {
      type: "varchar",
      length: 500,
      nullable: false,
    },
    formato: {
      type: "varchar",
      length: 10,
      nullable: false,
    },
    peso_mb: {
      type: "decimal",
      precision: 5,
      scale: 2,
      nullable: false,
    },
    fecha_subidabitacora: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    estado_revisionbitacora: {
      type: "enum",
      enum: ["pendiente", "revisado"],
      default: "pendiente",
    },

    notabitacora: {
      type: "float",
      length: 7,
      nullable: false,
    },
  },

  relations: {
    practica: {
      target: "Practica",
      type: "many-to-one",
      joinColumn: { name: "id_practica" },
      onDelete: "CASCADE",
    },
  },

  uniques: [
    {
      name: "UNQ_BITACORA_PRACTICA_SEMANA",
      columns: ["id_practica", "semana"],
    },
  ],
});

export default BitacoraSchema;
