import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { updateEvaluacion } from "@services/evaluacion.service";

export default function useUpdateEvaluacion(handleUpdateEstadoDocumento) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdateEvaluacion = useCallback(
        async (evaluacion, doc) => {
            const { value: formValues } = await Swal.fire({
                title: `Actualizar evaluación de ${doc.nombre}`,
                html: `
          <input id="swal-nota" class="swal2-input" placeholder="Nueva nota (1 a 7)" type="number" min="1" max="7" step="0.1" value="${evaluacion.nota || ""}">
          <textarea id="swal-comentario" class="swal2-textarea" placeholder="Comentario (opcional)">${evaluacion.comentario || ""}</textarea>
        `,
                focusConfirm: false,
                confirmButtonText: "Actualizar",
                cancelButtonText: "Cancelar",
                showCancelButton: true,
                preConfirm: () => {
                    const nota = parseFloat(document.getElementById("swal-nota").value);
                    const comentario = document.getElementById("swal-comentario").value;

                    if (isNaN(nota) && !comentario) {
                        Swal.showValidationMessage("Debe ingresar al menos una nota válida o comentario");
                        return false;
                    }
                    if (!isNaN(nota) && (nota < 1 || nota > 7)) {
                        Swal.showValidationMessage("La nota debe estar entre 1 y 7");
                        return false;
                    }

                    return { nota, comentario };
                },
            });

            if (!formValues) return;

            setLoading(true);
            setError(null);

            try {
                const res = await updateEvaluacion(evaluacion.id, {
                    nota: parseFloat(formValues.nota),
                    comentario: formValues.comentario,
                });

                if (handleUpdateEstadoDocumento) {
                    await handleUpdateEstadoDocumento(doc.id, { estado: "Revisado" });
                }

                Swal.fire({
                    icon: "success",
                    title: "Evaluación actualizada",
                    text: "Los datos se actualizaron correctamente.",
                    timer: 1800,
                    showConfirmButton: false,
                });

                return res;
            } catch (err) {
                setError(err.message || "Error al actualizar evaluación");
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

    return { handleUpdateEvaluacion, loading, error };
}
