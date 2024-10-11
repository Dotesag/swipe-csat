import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Импортируем новый компонент
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const UserForm = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // состояние для гамбургер-меню

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // переключение меню
    const { id } = useParams();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [password, setPassword] = useState(''); // состояние для пароля
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
                    headers: { Authorization: `${token}` },
                });
                setUsername(res.data.username);
                setEmail(res.data.email);
                setRole(res.data.role);
            };
            fetchUser();
        }
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = { username, email, role };
            // Добавляем пароль только для нового пользователя
            if (!id) {
                userData.password = password;
            }

            if (id) {
                await axios.put(`http://localhost:5000/api/users/${id}`, userData, {
                    headers: { Authorization: `${token}` },
                });
            } else {
                await axios.post('http://localhost:5000/api/users', userData, {
                    headers: { Authorization: `${token}` },
                });
            }
            navigate('/users');
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Ошибка при сохранении пользователя. Попробуйте еще раз.");
        }
    };

    return (
        <div className="container mt-4">
            <h1>{id ? 'Редактировать пользователя' : 'Добавить пользователя'}</h1>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} /> {/* Используем новый компонент */}
                <div className="flex-grow-1 p-3">
                    <button 
                        className="btn btn-primary mb-3" 
                        onClick={() => navigate(-1)} // Функция для возврата на предыдущую страницу
                    >
                        Назад
                    </button>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Имя пользователя</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                placeholder="Имя пользователя"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                maxLength={30} // Ограничение на 30 символов
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                maxLength={50} // Ограничение на 50 символов
                            />
                        </div>
                        {/* Поле для ввода пароля, только при создании нового пользователя */}
                        {!id && (
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Пароль</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    maxLength={20} // Ограничение на 20 символов
                                />
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Роль</label>
                            <select
                                id="role"
                                className="form-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="user">Пользователь</option>
                                <option value="productOwner">Владелец</option>
                                <option value="admin">Администратор</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Сохранить</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
