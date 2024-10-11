import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar'; // Импортируем новый компонент
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // состояние для гамбургер-меню

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // переключение меню

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `${token}` },
            });
            setUsers(res.data);
        };

        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
            headers: { Authorization: `${token}` },
        });
        setUsers(users.filter(user => user._id !== id));
    };

    return (
        <div className="container mt-4">
            <h1>Пользователи</h1>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} /> {/* Используем новый компонент */}
                <div className="flex-grow-1 p-3">
                    <Link to="/users/new" className="btn btn-primary mb-3">Добавить пользователя</Link>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Имя пользователя</th>
                                <th>Email</th>
                                <th>Роль</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <Link to={`/users/${user._id}/edit`} className="btn btn-sm btn-info mb-1">Редактировать</Link>
                                            <button onClick={() => deleteUser(user._id)} className="btn btn-sm btn-danger">Удалить</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersList;
