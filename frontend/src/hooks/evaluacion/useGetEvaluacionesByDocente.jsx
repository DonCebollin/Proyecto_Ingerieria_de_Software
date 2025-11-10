import { useState, useCallback } from 'react';
import { getEvaluacionesByDocente } from '@services/evaluacion.service';

export default function useGetEvaluacionesByDocente() {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetEvaluacionesByDocente = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getEvaluacionesByDocente();
            setEvaluaciones(res.data || res);
            return res;
        } catch (err) {
            setError(err.message || 'Error al obtener evaluaciones del docente');
        } finally {
            setLoading(false);
        }
    }, []);

    return { evaluaciones, handleGetEvaluacionesByDocente, loading, error };
}
