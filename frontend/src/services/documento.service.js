import axios from "./root.service";

export async function subirYRegistrarDocumento(formData) {
    try {
        const response = await axios.post("/documentos/subir", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error en subirYRegistrarDocumento:", error);
        throw error.response?.data || { message: "Error al subir y registrar documento" };
    }
}

export async function getDocumentos() {
    try {
        const response = await axios.get("/documentos/");
        return response.data;
    } catch (error) {
        console.error("Error al obtener documentos:", error);
        return [];
    }
}

export async function updateEstadoDocumento(id, estado) {
    try {
        const response = await axios.patch(`/documentos/${id}/estado`, {
            estado_revision: estado,
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
