import Search from '../components/Search';
import Popup from '../components/Popup';
import { useState, useEffect } from 'react';
import '../styles/comentario.css';
import { useDeleteComentario } from '../hooks/comentario/useDeleteComentario.jsx';
import { useUpdateComentario } from '../hooks/comentario/useUpdateComentario.jsx';
import { useCreateComentario } from '../hooks/comentario/useCreateComentario.jsx';
import { useGetAllComentarios } from '../hooks/comentario/useGetAllComentarios.jsx';

const Comentarios = () => { 
    const { comentarios, loading, error, fetchComentarios } = useGetAllComentarios();
    const { handleDeleteComentario } = useDeleteComentario(fetchComentarios);
    const { handleUpdateComentario } = useUpdateComentario(fetchComentarios);
    const { handleCreateComentario } = useCreateComentario(fetchComentarios);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState('create'); 
    const [selectedComentario, setSelectedComentario] = useState(null);
    
    useEffect(() => {
        fetchComentarios();
    }, [fetchComentarios]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredComentarios = comentarios.filter((comentario) =>
        comentario.mensaje.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenPopup = (mode, comentario = null) => {
        setPopupMode(mode);
        setSelectedComentario(comentario);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedComentario(null);
    };

    const handleSubmit = async (formData) => {
        if (popupMode === 'create') {
            await handleCreateComentario(formData);
        } else {
            await handleUpdateComentario(selectedComentario._id, formData);
        }
        handleClosePopup();
    };

    const fields = [
        { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true },
        { name: 'estado', label: 'Estado', type: 'select', options: ['Pendiente', 'Abierto', 'Respondido'], required: true },
        { name: 'nivelUrgencia', label: 'Nivel de Urgencia', type: 'select', options: ['normal', 'alta'], required: true },
        { name: 'tipoProblema', label: 'Tipo de Problema', type: 'select', options: ['Personal', 'General', 'De Empresa'], required: true }
    ];

    return (
        <div className='main-container'>
            <div className='content-container'>
                <div className='top-section'>
                    <h1 className='title'>Comentarios</h1>
                    <div className='filter-actions'>
                        <Search value={searchTerm} onChange={handleSearch} placeholder={'Buscar comentarios...'} />
                        <button onClick={() => handleOpenPopup('create')}>
                            <span>Crear Comentario</span>
                        </button>
                    </div>
                </div>

                <div className="comentarios-grid">
                    {loading && <p>Cargando comentarios...</p>}
                    {error && <p>Error al cargar los comentarios.</p>}
                    {!loading && !error && filteredComentarios.length > 0 ? (
                        filteredComentarios.map((comentario) => (
                            <div key={comentario._id} className="comentario-card">
                                <div className="comentario-header">
                                    <p className={`comentario-estado ${comentario.estado.replace(' ', '-')}`}>
                                        {comentario.estado}
                                    </p>
                                    <p className={`comentario-urgencia ${comentario.nivelUrgencia}`}>
                                        {comentario.nivelUrgencia}
                                    </p>
                                </div>
                                <div className="comentario-body">
                                    <p className="comentario-mensaje" title={comentario.mensaje}>
                                        {comentario.mensaje.length > 100
                                            ? `${comentario.mensaje.slice(0, 100)}...`
                                            : comentario.mensaje}
                                    </p>
                                    <p className="comentario-tipo">
                                        <strong>Tipo:</strong> {comentario.tipoProblema}
                                    </p>
                                </div>
                                <div className="comentario-footer">
                                    <p className="comentario-fecha">
                                        {new Date(comentario.fechaCreacion).toLocaleDateString()}
                                    </p>
                                    <div className="comentario-acciones">
                                        <button onClick={() => handleOpenPopup('edit', comentario)}>Editar</button>
                                        <button onClick={() => handleDeleteComentario(comentario._id)}>Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && <p>No hay comentarios que coincidan con la búsqueda.</p>
                    )}
                </div>

                {isPopupOpen && (
                    <Popup
                        mode={popupMode}
                        isOpen={isPopupOpen}
                        onClose={handleClosePopup}
                        onSubmit={handleSubmit}
                        fields={fields}
                        initialData={selectedComentario}
                        title={popupMode === 'create' ? 'Crear Comentario' : 'Editar Comentario'}
                    />
                )}
            </div>
        </div>
    );
};

export default Comentarios;
