import { useState} from "react";
import { createComentario } from '../../services/comentario.service.js';

export function useCreateComentario() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateComentario = async (dataComentario) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createComentario(dataComentario);
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return { handleCreateComentario, loading, error };
}
        

