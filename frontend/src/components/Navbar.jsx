import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import "@styles/navbar.css";
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
    const userRole = user?.rol;
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout();
            navigate("/auth");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const getActiveClass = ({ isActive }) => (isActive ? "active" : "");

    return (
        <nav className="navbar">
            <div className={`nav-menu ${menuOpen ? "activado" : ""}`}>
                <ul>
                    <li>
                        <NavLink
                            to="/home"
                            className={getActiveClass}
                            onClick={() => setMenuOpen(false)}
                        >
                            Inicio
                        </NavLink>
                    </li>

                    {userRole === "administrador" && (
                        <li>
                            <NavLink
                                to="/users"
                                className={getActiveClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                Usuarios
                            </NavLink>
                        </li>
                    )}

                    {userRole === "docente" && (
                        <li>
                            <NavLink
                                to="/documentos"
                                className={getActiveClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                Documentos
                            </NavLink>
                        </li>
                    )}

                    {userRole === "estudiante" && (
                        <li>
                            <NavLink
                                to="/docs-finales"
                                className={getActiveClass}
                                onClick={() => setMenuOpen(false)}
                            >
                                Mis Entregas
                            </NavLink>
                        </li>
                    )}

                    <li>
                        <button
                            onClick={() => {
                                logoutSubmit();
                                setMenuOpen(false);
                            }}
                            className="logout-btn"
                        >
                            Cerrar sesión
                        </button>
                    </li>
                </ul>
            </div>

            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;
