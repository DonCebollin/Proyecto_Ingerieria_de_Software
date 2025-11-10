import axios from './root.service';

export async function crearEvaluacion(data) {
    try {
        const response = await axios.post('/evaluaciones', data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getEvaluacionesByDocumento(id_documento) {
    try {
        const response = await axios.get(`/evaluaciones/documento/${id_documento}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateEvaluacion(id, data) {
    try {
        const response = await axios.patch(`/evaluaciones/${id}`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getEvaluacionesByDocente() {
    try {
        const response = await axios.get('/evaluaciones/docente');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
