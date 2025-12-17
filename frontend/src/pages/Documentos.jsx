import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Search from "../components/Search";
import "../styles/Documentos.css";

import useGetDocumentos from "@hooks/documentos/useGetDocumentos.jsx";
import useUpdateEstadoDocumento from "@hooks/documentos/useUpdateEstadoDocumento.jsx";
import useGetEvaluacionesByDocente from "@hooks/evaluacion/useGetEvaluacionesByDocente.jsx";
import useUpdateEvaluacion from "@hooks/evaluacion/useUpdateEvaluacion.jsx";
import useCrearEvaluacion from "@hooks/evaluacion/useCrearEvaluacion.jsx";
import useUsers from "@hooks/users/useGetUsers.jsx";

const Documentos = () => {
    const [filter, setFilter] = useState("");
    const [documents, setDocuments] = useState([]);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const [currentPage, setCurrentPage] = useState(1);
    const docsPerPage = 6;

    const { handleGetDocumentos, loading: loadingDocs } = useGetDocumentos();
    const { handleUpdateEstadoDocumento } = useUpdateEstadoDocumento();
    const { handleCrearEvaluacion } = useCrearEvaluacion(handleUpdateEstadoDocumento);
    const { handleUpdateEvaluacion } = useUpdateEvaluacion(handleUpdateEstadoDocumento);

    const {
        evaluaciones,
        handleGetEvaluacionesByDocente,
        loading: loadingEvalDocente,
    } = useGetEvaluacionesByDocente();

    const { handleGetUsers } = useUsers();

    // 🔹 Datos de ejemplo (solo para pruebas sin backend)
    const documentosEjemplo = [
        {
            id: 1,
            nombre: "Informe de práctica - Ana Torres",
            estado: "Pendiente",
            id_practica: 1,
            archivos: ["informe_ana.pdf","bitacora_carlos.pdf"],
            comentario: "Pendiente de revisión inicial.",
        },
        {
            id: 2,
            nombre: "Bitácora semanal - Carlos Pérez",
            estado: "Revisado",
            id_practica: 1,
            archivos: ["bitacora_carlos.pdf"],
            comentario: "Buen trabajo, faltan firmas del tutor.",
        },
        {
            id: 3,
            nombre: "Proyecto final - María Gómez",
            estado: "Pendiente",
            id_practica: 1,
            archivos: ["proyecto_maria.docx","bitacora_carlos.pdf"],
            comentario: "",
        },
        {
            id: 4,
            nombre: "Evaluación práctica - Luis Contreras",
            estado: "Revisado",
            id_practica: 1,
            archivos: ["evaluacion_luis.pdf"],
            comentario: "Excelente desempeño.",
        },
        {
            id: 5,
            nombre: "Informe técnico - Sofía Ramírez",
            estado: "Pendiente",
            id_practica: 1,
            archivos: ["informe_sofia.pdf"],
            comentario: "",
        },
        {
            id: 6,
            nombre: "Bitácora de terreno - Diego Fuentes",
            estado: "Revisado",
            id_practica: 1,
            archivos: ["bitacora_diego.docx"],
            comentario: "Completa y clara, buen formato.",
        },
        {
            id: 7,
            nombre: "Resumen de práctica - Valentina Silva",
            estado: "Pendiente",
            id_practica: 1,
            archivos: ["resumen_valentina.pdf"],
            comentario: "Debe incluir resumen ejecutivo.",
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            // 🔹 Mostrar los documentos de ejemplo (sin backend)
            setDocuments(documentosEjemplo);

            // Si quieres volver a usar los hooks del backend:
            // await handleGetUsers();
            // const resDocs = await handleGetDocumentos();
            // const todosDocs =
            //     Array.isArray(resDocs) ? resDocs : Array.isArray(resDocs?.data) ? resDocs.data : [];
            // const docsFiltrados = todosDocs.filter((doc) => doc.id_practica === 1);
            // setDocuments(docsFiltrados);
            // await handleGetEvaluacionesByDocente();
        };
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleDownload = (archivo) => {
        const link = document.createElement("a");
        link.href = `/uploads/${archivo}`;
        link.download = archivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAddNote = async (doc) => {
        const evaluacionExistente = evaluaciones?.find((e) => e.id_documento === doc.id);
        if (evaluacionExistente) {
            await handleUpdateEvaluacion(evaluacionExistente, doc);
        } else {
            await handleCrearEvaluacion(doc);
        }
    };

    // 🔹 Filtro de búsqueda y estado
    const filteredDocs = documents.filter((doc) => {
        const matchesName = doc.nombre?.toLowerCase().includes(filter.toLowerCase());
        const matchesEstado = estadoFiltro === "todos" || doc.estado === estadoFiltro;
        return matchesName && matchesEstado;
    });

    const indexOfLast = currentPage * docsPerPage;
    const indexOfFirst = indexOfLast - docsPerPage;
    const currentDocs = filteredDocs.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredDocs.length / docsPerPage);

    const handlePageChange = (num) => {
        if (num >= 1 && num <= totalPages) setCurrentPage(num);
    };

    return (
        <div className="documentos-container">
            <div className="documentos-content">
                <div className="tabla-docs">
                    {loadingDocs || loadingEvalDocente ? (
                        <p>Cargando documentos...</p>
                    ) : currentDocs.length > 0 ? (
                        currentDocs.map((doc, index) => (
                            <div key={index} className="doc-card">
                                <div className="doc-header">
                                    <p
                                        className={`doc-estado ${
                                            doc.estado === "Revisado" ? "revisado" : "pendiente"
                                        }`}
                                    >
                                        {doc.estado || "Pendiente"}
                                    </p>

                                    <p className="doc-nombre">
                                        <strong title={doc.nombre}>
                                            {doc.nombre?.length > 25
                                                ? `${doc.nombre.slice(0, 25)}...`
                                                : doc.nombre}
                                        </strong>
                                    </p>
                                </div>

                                <div className="doc-alumno-info">
                                    <p>
                                        <strong>Alumno:</strong>{" "}
                                        {doc.nombre.includes(" - ")
                                            ? doc.nombre.split(" - ")[1]
                                            : "No especificado"}
                                    </p>
                                </div>

                                <div className="doc-info">
                                    {doc.archivos?.map((a, i) => (
                                        <p key={i} className="archivo-item" title={a}>
                                            {a.length > 35 ? `${a.slice(0, 35)}...` : a}
                                        </p>
                                    ))}
                                    {doc.comentario && (
                                        <p className="comentario" title={doc.comentario}>
                                            {doc.comentario.length > 80
                                                ? `${doc.comentario.slice(0, 80)}...`
                                                : doc.comentario}
                                        </p>
                                    )}
                                </div>

                                <div className="doc-acciones">
                                    <button
                                        onClick={() =>
                                            doc.archivos?.forEach((a) => handleDownload(a))
                                        }
                                    >
                                        Descargar
                                    </button>
                                    <button onClick={() => handleAddNote(doc)}>Nota</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay documentos encontrados.</p>
                    )}
                </div>

                <div className="paginacion">
                    <Search
                        value={filter}
                        onChange={handleFilterChange}
                        placeholder="nombre o rut"
                    />

                    <div className="estado-buttons">
                        {["Pendiente", "Revisado", "todos"].map((estado) => (
                            <button
                                key={estado}
                                className={`btn-action ${
                                    estadoFiltro === estado ? "active" : ""
                                }`}
                                onClick={() => setEstadoFiltro(estado)}
                            >
                                {estado}
                            </button>
                        ))}
                    </div>

                    <button onClick={() => handlePageChange(1)}>Primero</button>
                    <button onClick={() => handlePageChange(currentPage - 1)}>{"<"}</button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={currentPage === i + 1 ? "active" : ""}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)}>{">"}</button>
                    <button onClick={() => handlePageChange(totalPages)}>Último</button>
                </div>
            </div>
        </div>
    );
};

export default Documentos;
