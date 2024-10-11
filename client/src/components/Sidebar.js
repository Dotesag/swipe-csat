import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faList, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Sidebar = ({ isMenuOpen, toggleMenu }) => {
    const [isSurveysOpen, setIsSurveysOpen] = useState(false);
    const [isResponsesOpen, setIsResponsesOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [isDataOpen, setIsDataOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false); // Новое состояние для "Истории ответов"
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `${localStorage.getItem('token')}` }
                });
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Ошибка получения роли пользователя:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    const isUser = () => userRole === 'user';
    const isAdmin = () => userRole === 'admin';
    const isOwner = () => userRole === 'productOwner';

    const toggleSurveys = () => setIsSurveysOpen(!isSurveysOpen);
    const toggleResponses = () => setIsResponsesOpen(!isResponsesOpen);
    const toggleProducts = () => setIsProductsOpen(!isProductsOpen);
    const toggleUsers = () => setIsUsersOpen(!isUsersOpen);
    const toggleData = () => setIsDataOpen(!isDataOpen);
    const toggleHistory = () => setIsHistoryOpen(!isHistoryOpen); // Функция для переключения "Истории ответов"

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className={`bg-light p-3 me-3 mb-3 ${isMenuOpen ? 'd-block' : 'd-none d-md-block'}`} style={{ minWidth: '250px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h5 className="border-bottom pb-2" style={{ fontWeight: 'bold' }}>Меню</h5>
            <ul className="list-group">
                {!isUser() && (
                    <li className="list-group-item" onClick={toggleProducts} style={{ cursor: 'pointer' }}>
                        <strong><FontAwesomeIcon icon={faList} /> Мои продукты</strong>
                    </li>
                )}
                {isProductsOpen && (
                    <ul className="list-group ms-3">
                        <li className="list-group-item">
                            <Link to="/my-products" className="text-decoration-none">
                                <FontAwesomeIcon icon={faList} /> Посмотреть
                            </Link>
                        </li>
                        <li className="list-group-item">
                            <Link to="/create-product" className="text-decoration-none">
                                <FontAwesomeIcon icon={faPlus} /> Добавить
                            </Link>
                        </li>
                    </ul>
                )}
                {!isUser() && (
                    <li className="list-group-item" onClick={toggleSurveys} style={{ cursor: 'pointer' }}>
                        <strong><FontAwesomeIcon icon={faList} /> Характеристики</strong>
                    </li>
                )}
                {isSurveysOpen && (
                    <ul className="list-group ms-3">
                        <li className="list-group-item">
                            <Link to="/survey" className="text-decoration-none">
                                <FontAwesomeIcon icon={faList} /> Посмотреть
                            </Link>
                        </li>
                        <li className="list-group-item">
                            <Link to="/add-survey" className="text-decoration-none">
                                <FontAwesomeIcon icon={faPlus} /> Добавить
                            </Link>
                        </li>
                    </ul>
                )}
                {!isUser() && (
                    <li className="list-group-item" onClick={toggleResponses} style={{ cursor: 'pointer' }}>
                        <strong><FontAwesomeIcon icon={faList} /> Ответы</strong>
                    </li>
                )}
                {isResponsesOpen && (
                    <ul className="list-group ms-3">
                        <li className="list-group-item">
                            <Link to="/responses" className="text-decoration-none">
                                <FontAwesomeIcon icon={faList} /> Посмотреть
                            </Link>
                        </li>
                    </ul>
                )}
                {isAdmin() && (
                    <li className="list-group-item" onClick={toggleUsers} style={{ cursor: 'pointer' }}>
                        <strong><FontAwesomeIcon icon={faList} /> Пользователи</strong>
                    </li>
                )}
                {isUsersOpen && (
                    <ul className="list-group ms-3">
                        <li className="list-group-item">
                            <Link to="/users" className="text-decoration-none">
                                <FontAwesomeIcon icon={faList} /> Посмотреть
                            </Link>
                        </li>
                        <li className="list-group-item">
                            <Link to="/users/new" className="text-decoration-none">
                                <FontAwesomeIcon icon={faPlus} /> Добавить
                            </Link>
                        </li>
                    </ul>
                )}
                {/* Новый пункт "История ответов" */}
                <li className="list-group-item" onClick={toggleHistory} style={{ cursor: 'pointer' }}>
                    <strong><FontAwesomeIcon icon={faList} /> История ответов</strong>
                </li>
                {isHistoryOpen && (
                    <ul className="list-group ms-3">
                        <li className="list-group-item">
                            <Link to="/history" className="text-decoration-none">
                                <FontAwesomeIcon icon={faList} /> Посмотреть историю
                            </Link>
                        </li>
                    </ul>
                )}
                <li className="list-group-item" onClick={toggleData} style={{ cursor: 'pointer' }}>
                    <strong><FontAwesomeIcon icon={faList} /> Настройки</strong>
                </li>
                {isDataOpen && (
                    <ul className="list-group ms-3">
                        <li className="list-group-item">
                            <Link to="/settings" className="text-decoration-none">
                                <FontAwesomeIcon icon={faList} /> Изменить данные
                            </Link>
                        </li>
                    </ul>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
