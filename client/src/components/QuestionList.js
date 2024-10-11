import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link,useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Импортируем новый компонент
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const QuestionList = () => {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // состояние для гамбургер-меню

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // переключение меню
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/surveys/${id}`);
                setQuestions(response.data.questions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [id]);

    const handleDelete = async (questionId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/surveys/${id}/questions/${questionId}`, {
                headers: { Authorization: `${token}` },
            });
            // Обновите состояние, чтобы удалить удаленный вопрос
            setQuestions((prevQuestions) => prevQuestions.filter(question => question._id !== questionId));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Вопросы в характеристике</h2>
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
                    <br/>
                    <Link to={`/surveys/${id}/add-question`} className="btn btn-primary mb-3">Добавить вопрос</Link>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Вопрос</th>
                                <th>Варианты ответов</th>
                                <th>Баллы</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map(question => (
                                <tr key={question._id}>
                                    <td>{question.text}</td>
                                    <td>
                                        <ul>
                                            {question.options.map((option, index) => (
                                                <li key={index}>{option.text}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <ul>
                                            {question.options.map((option, index) => (
                                                <li key={index}>{option.value}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <Link to={`/surveys/${id}/edit-question/${question._id}`} className="btn btn-warning me-2">Редактировать</Link>
                                        <button onClick={() => handleDelete(question._id)} className="btn btn-danger">Удалить</button>
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

export default QuestionList;
