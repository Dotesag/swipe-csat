import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [username, setUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); 

    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setSuccessMessage('Вход успешен!');
            setIsLoggedIn(true);
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Ошибка входа:', error);
            setError('Неверный email или пароль. Попробуйте еще раз.');
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const token = localStorage.getItem('token');

        if (!token) {
            setError('Вы не авторизованы. Пожалуйста, войдите в систему.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:5000/api/auth/update', {
                username: username || undefined,
                email: newEmail || undefined,
                password: newPassword || undefined,
            }, {
                headers: { Authorization: `${token}` }
            });

            if (response.status === 200) {
                setSuccessMessage('Данные успешно обновлены!');
                toast.success('Пароль успешно изменен!');
                setUsername('');
                setNewEmail('');
                setNewPassword('');

                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            }
        } catch (error) {
            console.error('Ошибка обновления:', error);
            setError('Не удалось обновить данные. Попробуйте еще раз.');
            toast.error('Ошибка при обновлении данных.');
        }
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <h2>Настройки</h2>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <div className="flex-grow-1 p-3">
                    {!isLoggedIn && <h2>Для изменения данных необходимо подтвердить свои данные</h2>}
                    
                    {!isLoggedIn && (
                        <form onSubmit={handleLoginSubmit} className="mb-4">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Пароль:</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                            <button type="submit" className="btn btn-primary">Войти</button>
                        </form>
                    )}

                    {isLoggedIn && (
                        <>
                            <h2>Изменить данные</h2>
                            <form onSubmit={handleUpdateSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Новый никнейм:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newEmail" className="form-label">Новый Email:</label>
                                    <input
                                        type="email"
                                        id="newEmail"
                                        className="form-control"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label">Новый пароль:</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        className="form-control"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Обновить данные</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SettingsPage;
