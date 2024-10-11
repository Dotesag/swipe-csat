import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Импортируем новый компонент
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // состояние для гамбургер-меню

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // переключение меню

    return (
        <div className="container mt-4">
            <h2>Панель управления</h2>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} /> {/* Используем новый компонент */}
                <div className="flex-grow-1 p-3">
                    <h5>Добро пожаловать в панель управления!</h5>
                    <p>Здесь вы можете управлять категориями и характеристиками.</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
