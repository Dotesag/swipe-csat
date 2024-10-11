import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const RequireAuth = ({ children, allowedRoles = [] }) => {
    const [userRole, setUserRole] = useState('');
    const token = localStorage.getItem('token'); // Проверка на наличие токена
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `${localStorage.getItem('token')}` }
                });
                setUserRole(response.data.role); // Предполагается, что ответ содержит поле 'role'
            } catch (error) {
                console.error('Ошибка получения роли пользователя:', error);
            }
        };
        fetchUserRole();
    }, []);
    if (!token) {
        return <Navigate to="/login" />; // Перенаправление на страницу входа
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/profile"/>;
      }

    return children; // Возвращаем дочерние элементы, если пользователь авторизован
};

export default RequireAuth;