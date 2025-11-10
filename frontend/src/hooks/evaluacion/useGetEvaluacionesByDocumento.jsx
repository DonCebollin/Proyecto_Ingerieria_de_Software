import { useState, useCallback } from 'react';
import { getEvaluacionesByDocumento } from '@services/evaluacion.service';

export default function useGetEvaluacionesByDocumento() {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetEvaluacionesByDocumento = useCallback(async (id_documento) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getEvaluacionesByDocumento(id_documento);
            setEvaluaciones(res.data || res);
            return res;
        } catch (err) {
            setError(err.message || 'Error al obtener evaluaciones del documento');
        } finally {
            setLoading(false);
        }
    }, []);

    return { evaluaciones, handleGetEvaluacionesByDocumento, loading, error };
}
