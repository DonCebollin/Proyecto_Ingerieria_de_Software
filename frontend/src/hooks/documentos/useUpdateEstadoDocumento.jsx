import { useState, useCallback } from 'react';
import { updateEstadoDocumento } from '@services/documento.service';

export default function useUpdateEstadoDocumento() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdateEstadoDocumento = useCallback(async (id, estado) => {
        setLoading(true);
        setError(null);
        try {
            const [res] = await Promise.all([updateEstadoDocumento(id, estado)]);
            return res;
        } catch (err) {
            setError(err.message || 'Error al actualizar estado');
        } finally {
            setLoading(false);
        }
    }, []);

    return { handleUpdateEstadoDocumento, loading, error };
}
