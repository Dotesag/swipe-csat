import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return token !== null;
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload(); // или используйте navigate для редиректа
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    CSAT
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isAuthenticated() && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Панель управления</Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {!isAuthenticated() ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Вход</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Регистрация</Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={handleLogout}>Выход</button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
