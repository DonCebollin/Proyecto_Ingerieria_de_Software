import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { crearEvaluacion } from "@services/evaluacion.service";

export default function useCrearEvaluacion(handleUpdateEstadoDocumento) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCrearEvaluacion = useCallback(
        async (doc) => {
            const { value: formValues } = await Swal.fire({
                title: `Evaluar ${doc.nombre}`,
                html: `
          <input id="swal-nota-informe" class="swal2-input" placeholder="Nota Informe" type="number" min="1" max="7" step="0.1">
          <input id="swal-nota-auto" class="swal2-input" placeholder="Nota Autoevaluación" type="number" min="1" max="7" step="0.1">
          <textarea id="swal-comentario" class="swal2-textarea" placeholder="Comentario (opcional)"></textarea>
        `,
                focusConfirm: false,
                confirmButtonText: "Guardar",
                cancelButtonText: "Cancelar",
                showCancelButton: true,
                preConfirm: () => {
                    const nota_informe = parseFloat(document.getElementById("swal-nota-informe").value);
                    const nota_auto = parseFloat(document.getElementById("swal-nota-auto").value);
                    const comentario = document.getElementById("swal-comentario").value;

                    if (
                        (isNaN(nota_informe) || nota_informe < 1 || nota_informe > 7) &&
                        (isNaN(nota_auto) || nota_auto < 1 || nota_auto > 7) &&
                        !comentario
                    ) {
                        Swal.showValidationMessage("Debe ingresar al menos una nota válida o comentario");
                        return false;
                    }

                    let nota = null;
                    if (!isNaN(nota_informe) && !isNaN(nota_auto))
                        nota = ((nota_informe + nota_auto) / 2).toFixed(1);
                    else if (!isNaN(nota_informe)) nota = nota_informe;
                    else if (!isNaN(nota_auto)) nota = nota_auto;

                    return { nota, comentario };
                },
            });

            if (!formValues) return;

            setLoading(true);
            setError(null);

            try {
                const res = await crearEvaluacion({
                    id_practica: doc.id_practica,
                    nota: parseFloat(formValues.nota),
                    comentario: formValues.comentario,
                });

                if (handleUpdateEstadoDocumento) {
                    await handleUpdateEstadoDocumento(doc.id, { estado: "Revisado" });
                }

                Swal.fire({
                    icon: "success",
                    title: "Evaluación creada",
                    text: "La nota y el comentario se guardaron correctamente.",
                    timer: 1800,
                    showConfirmButton: false,
                });

                return res;
            } catch (err) {
                setError(err.message || "Error al crear evaluación");
                Swal.fire({
                    icon: "error",
                    title: "Error inesperado",
                    text: err.message,
                });
                return { error: err };
            } finally {
                setLoading(false);
            }
        },
        [handleUpdateEstadoDocumento]
    );

    return { handleCrearEvaluacion, loading, error };
}
