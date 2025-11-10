import { useState, useCallback } from 'react';
import { getDocumentos } from '@services/documento.service';

export default function useGetDocumentos() {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetDocumentos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getDocumentos();
            const docs = res.data?.map((d) => ({
                id_documento: d.id_documento,
                nombre: d.nombre_archivo,
                url_archivo: d.ruta_archivo,
                fecha_subida: d.fecha_subida,
                estado_revision: d.estado_revision,
                nota: d.nota || null,
                comentario: d.comentario || null,
            })) || [];
            setDocumentos(docs);
        } catch (err) {
            console.error('Error al obtener documentos:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { documentos, handleGetDocumentos, loading, error };
}
