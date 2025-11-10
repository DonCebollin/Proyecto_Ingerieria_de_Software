import { useState } from "react";
import { subirYRegistrarDocumento } from "@services/documento.service.js";
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert.js";

const useSubirDocumento = (fetchDocumentos) => {
    const [loading, setLoading] = useState(false);

    const handleSubir = async (file, idPractica) => {
        if (!file) {
            showErrorAlert("Error", "Debes seleccionar un archivo primero.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append(file.name.includes("informe") ? "informe" : "autoevaluacion", file);
            formData.append("id_practica", idPractica);

            const response = await subirYRegistrarDocumento(formData);

            showSuccessAlert("¡Éxito!", "El documento se subió y registró correctamente.");
            await fetchDocumentos();
            return response;
        } catch (error) {
            console.error("Error al subir documento:", error);
            showErrorAlert("Error", error.message || "Error al subir el documento.");
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSubir,
        loading,
    };
};

export default useSubirDocumento;
