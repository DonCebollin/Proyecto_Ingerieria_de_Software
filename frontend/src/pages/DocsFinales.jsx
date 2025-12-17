import { useState, useEffect } from "react";
import "@styles/DocsFinales.css";

import useGetDocumentos from "@hooks/documentos/useGetDocumentos";
import useSubirDocumento from "@hooks/documentos/useSubirDocumento";

const Documentos = () => {
    const [informeFile, setInformeFile] = useState(null);
    const [autoevaluacionFile, setAutoevaluacionFile] = useState(null);
    const [filter] = useState("");

    const { documentos, handleGetDocumentos, loading, error } = useGetDocumentos();
    const { handleSubir, loading: uploading } = useSubirDocumento(handleGetDocumentos);

    useEffect(() => {
        handleGetDocumentos();
    }, [handleGetDocumentos]);

    const handleFileChange = (e, tipo) => {
        const file = e.target.files[0];
        if (!file) return;

        switch (tipo) {
            case "informe":
                setInformeFile(file);
                break;
            case "autoevaluacion":
                setAutoevaluacionFile(file);
                break;
            default:
                break;
        }
    };

    const handleRemoveFile = (tipo) => {
        switch (tipo) {
            case "informe":
                setInformeFile(null);
                break;
            case "autoevaluacion":
                setAutoevaluacionFile(null);
                break;
            default:
                break;
        }
    };

    const handleSubirArchivos = async () => {
        if (!informeFile && !autoevaluacionFile)
            return alert("Debes seleccionar al menos un archivo.");

        try {
            const formData = new FormData();
            if (informeFile) formData.append("informe", informeFile);
            if (autoevaluacionFile) formData.append("autoevaluacion", autoevaluacionFile);
            formData.append("id_practica", 1);

            await handleSubir(formData);

            setInformeFile(null);
            setAutoevaluacionFile(null);
        } catch (err) {
            console.error("Error al subir archivos:", err);
        }
    };

    const filteredDocs = documentos.filter((d) =>
        d.nombre?.toLowerCase().includes(filter.toLowerCase())
    );

    const documentosCompletos = documentos.length >= 2;

    const getDocumentoPorTipo = (index) => documentos[index] || null;

    return (
        <div className="documentos-container">
            <div className="documentos-content">
                <div className="documentos-header">
                    <h2 className="documentos-title">Subida de Informes</h2>
                </div>

                <div className="upload-section-main">
                    <div className="upload-buttons-row">
                        <div className="file-slot">
                            {getDocumentoPorTipo(0) ? (
                                <button
                                    className="upload-btn"
                                    onClick={() =>
                                        window.open(getDocumentoPorTipo(0).url_archivo, "_blank")
                                    }
                                >
                                    Informe
                                </button>
                            ) : (
                                <>
                                    <label className="upload-btn">
                                        Informe
                                        <input
                                            type="file"
                                            accept=".pdf,.docx"
                                            onChange={(e) => handleFileChange(e, "informe")}
                                            hidden
                                        />
                                    </label>
                                    {informeFile && (
                                        <div className="selected-file">
                                            <span>{informeFile.name}</span>
                                            <button
                                                className="remove-file"
                                                onClick={() => handleRemoveFile("informe")}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="file-slot">
                            {getDocumentoPorTipo(1) ? (
                                <button
                                    className="upload-btn"
                                    onClick={() =>
                                        window.open(getDocumentoPorTipo(1).url_archivo, "_blank")
                                    }
                                >
                                    Autoevaluacion
                                </button>
                            ) : (
                                <>
                                    <label className="upload-btn">
                                        Autoevaluacion
                                        <input
                                            type="file"
                                            accept=".pdf,.docx"
                                            onChange={(e) => handleFileChange(e, "autoevaluacion")}
                                            hidden
                                        />
                                    </label>
                                    {autoevaluacionFile && (
                                        <div className="selected-file">
                                            <span>{autoevaluacionFile.name}</span>
                                            <button
                                                className="remove-file"
                                                onClick={() => handleRemoveFile("autoevaluacion")}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                    <label className="">  Nota</label>

                                </>
                            )}
                        </div>

                        {!documentosCompletos && (
                            <button
                                onClick={handleSubirArchivos}
                                className="btn-upload"
                                disabled={uploading || (!informeFile && !autoevaluacionFile)}
                            >
                                {uploading ? "Subiendo..." : "Subir"}
                            </button>
                        )}
                    </div>

                    <div className="main-actions" style={{ marginTop: "20px" }}>
                        <button className="btn-upload">Reglamento</button>
                        <button className="btn-download">Descargar Plantillas</button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="table-section">
                    <div className="document-table">
                        <div className="table-header">
                            <div>Nombre</div>
                            <div>Fecha entrega</div>
                            <div>Estado</div>
                            <div>Correo docente</div>
                            <div>Nota</div>
                        </div>

                        {loading && <p>Cargando documentos...</p>}
                        {error && <p>Error al cargar documentos</p>}
                        {!loading && filteredDocs.length === 0 && (
                            <p>No se encontraron documentos</p>
                        )}

                        {filteredDocs.map((doc) => (
                            <div key={doc.id_documento} className="document-row">
                                <div className="row-main">
                                    <div>{doc.nombre}</div>
                                    <div>
                                        {doc.fecha_subida
                                            ? new Date(doc.fecha_subida).toLocaleDateString()
                                            : "-"}
                                    </div>
                                    <div>{doc.estado_revision}</div>
                                    <div>{doc.correo_docente || "-"}</div>
                                    <div>{doc.nota || "-"}</div>
                                </div>
                                {doc.comentario && (
                                    <div className="comment-row">
                                        <p>{doc.comentario}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documentos;
