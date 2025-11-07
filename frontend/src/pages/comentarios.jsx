import Table from '../components/Table/Table';
import useComentarios from '../hooks/comentarios/useGetComentarios.jsx';
import Search from '../components/Search';
import Popup from '../components/Popup';
import { useCallback, useState } from 'react';
import '@styles/comentarios.css';
import useDeleteComentario from '../hooks/comentario/useDeleteComentario.jsx';
import DeleteIcon from '../assets/deleteIcon.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import useEditComentario from '../hooks/comentario/useEditComentario.jsx';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import useCreateComentario from '../hooks/comentario/useCreateComentario.jsx';
import useGetAllComentarios from '../hooks/comentario/useGetAllComentarios.jsx';

const Comentarios = () => { 
    const { comentarios, loading, error, fetchComentarios } = useComentarios();
    const { comentarios: allComentarios } = useGetAllComentarios();
    const { handleDeleteComentario, loading: deleteLoading } = useDeleteComentario();
    const { handleEditComentario, loading: editLoading } = useEditComentario();
    const { handleCreateComentario, loading: createLoading } = useCreateComentario();
    const [searchTerm, setSearchTerm] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState('create'); 
    const [selectedComentario, setSelectedComentario] = useState(null);
    const [tableKey, setTableKey] = useState(0);
    const [refreshFlag, setRefreshFlag] = useState(false);
    
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredComentarios = comentarios.filter((comentario) =>
        comentario.texto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenPopup = (mode, comentario = null) => {
        setPopupMode(mode);
        setSelectedComentario(comentario);
        setIsPopupOpen(true);
    };

    const handleRefresh = () => {
        setRefreshFlag(!refreshFlag);
        setTableKey(prevKey => prevKey + 1); 
        fetchComentarios();
    };
    
    const columns = [
        { comentario.mensaje && 'mensaje' },
        { comentario.fechaCreacion && 'fecha de creación' },
        { comentario.estado && 'estado' },
        { comentario.nivelUrgencia && 'nivel de urgencia' },
        { comentario.tipoProblema && 'tipo de problema' },
        { 'acciones' }
    ];
    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Comentarios</h1>
                    <div className='filter-actions'>
                        <Search value={searchTerm} onChange={handleSearch} placeholder={'Buscar comentarios...'} />
                        
