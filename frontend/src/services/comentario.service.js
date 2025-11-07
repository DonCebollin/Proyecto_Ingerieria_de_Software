import axios from './root.service.js';

export async function createComentario(dataComentario) {
    try {
        const response = await axios.post('/comentario', dataComentario);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getComentarios() {
    try {
        const response = await axios.get('/comentario');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getComentarioById(id) {
    try {
        const response = await axios.get(`/comentario/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function updateComentario(id, dataComentario) {
    try {
        const response = await axios.put(`/comentario/${id}`, dataComentario);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function deleteComentario(id) {
    try {
        const response = await axios.delete(`/comentario/${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getComentariosByUsuarioId(usuarioId) {
    try {
        const response = await axios.get(`/comentario/usuario/${usuarioId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export async function getAllComentarios() {
    try {
        const response = await axios.get('/comentario/todos');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

