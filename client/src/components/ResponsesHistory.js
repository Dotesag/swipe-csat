import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'; // Исправлено на именованный экспорт

const ResponsesPage = () => {
    const [responses, setResponses] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Добавлен флаг загрузки
    const [error, setError] = useState(null); // Добавлен флаг для ошибок

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Получение всех ответов пользователя
    useEffect(() => {
        const fetchUserResponses = async () => {
            try {
                const token = localStorage.getItem('token');
                let userId;

                if (token) {
                    try {
                        const decodedToken = jwtDecode(token); // Декодируем токен
                        userId = decodedToken.userId; // Предполагаем, что userId хранится в поле userId токена
                    } catch (error) {
                        console.error('Failed to decode token:', error);
                        setError('Не удалось декодировать токен');
                        return;
                    }
                } else {
                    userId = 'guest'; // Пишем 'guest' для неавторизованных пользователей
                }

                const response = await fetch(`http://localhost:5000/api/responses/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Ошибка загрузки ответов');

                const data = await response.json();
                setResponses(data);
            } catch (error) {
                console.error(error);
                setError('Не удалось загрузить ответы');
            } finally {
                setLoading(false); // Отключаем режим загрузки после получения данных
            }
        };

        fetchUserResponses();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Показываем, пока данные загружаются
    }

    if (error) {
        return <div>{error}</div>; // Показываем сообщение об ошибке
    }

    return (
        <div className="container mt-4">
            <h2>История ответов</h2>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
            <Container className="mt-5">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Характеристика</th>
                            <th>Вопросы</th>
                            <th>Ответы</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((response) => (
                            <tr key={response._id}>
                                <td>{new Date(response.createdAt).toLocaleString()}</td>
                                <td>{response.survey?.title || 'Без названия'}</td> {/* Добавлена проверка на null */}
                                <td>
                                    <ul>
                                        {response.answers.map((answer, index) => (
                                            <li key={index}>
                                                {answer.questionText || 'Нет вопроса'} {/* Проверка на null */}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        {response.answers.map((answer, index) => (
                                            <li key={index}>
                                                {answer.answerText || 'Нет ответа'} {/* Проверка на null */}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default ResponsesPage;
