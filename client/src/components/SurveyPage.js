import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Импортируем useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'

const SurveyPage = () => {
    const { id } = useParams();
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responses, setResponses] = useState({});
    const [submitMessage, setSubmitMessage] = useState(null); // Состояние для сообщения о результате отправки

    const navigate = useNavigate(); // Инициализируем useNavigate

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/surveys/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSurvey(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching survey:', error);
                setLoading(false);
            }
        };

        fetchSurvey();
    }, [id]);

    const handleResponseChange = (questionIndex, value) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [questionIndex]: value,
        }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        // const userId = localStorage.getItem('userId'); // Получаем идентификатор пользователя из localStorage

        let userId;

        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Декодируем токен
                userId = decodedToken.userId; // Предполагаем, что userId хранится в поле userId токена
            } catch (error) {
                console.error('Failed to decode token:', error);
                setSubmitMessage({ text: 'Ошибка при декодировании токена.', type: 'error' });
                return;
            }
        } else {
            userId = 'guest';// пишем гость, для неавторизивоанных людей
        }

        const responseData = {
            surveyId: id,
            userid: userId, // Добавляем userId в данные отправки   
            answers: survey.questions.map((question, index) => {
                const selectedOption = question.options.find(option => option.value === responses[index]);
                return {
                    questionText: question.text,
                    answerText: selectedOption ? selectedOption.text : '',
                    value: selectedOption ? selectedOption.value : 0,
                };
            }),
        };
    
        try {
            const response = await fetch(`http://localhost:5000/api/surveys/${id}/responses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responseData),
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit responses');
            }
            const result = await response.json();
            setSubmitMessage({ text: 'Ответы успешно отправлены!', type: 'success' }); // Успешное сообщение
        } catch (error) {
            console.error('Error submitting responses:', error);
            setSubmitMessage({ text: 'Ошибка при отправке ответов. Попробуйте еще раз.', type: 'error' }); // Сообщение об ошибке
        }
    
        // Удаляем сообщение через 5 секунд
        setTimeout(() => {
            setSubmitMessage(null);
        }, 5000);
    };

    const handleGoBack = () => {
        navigate(-1); // Возвращает пользователя на предыдущую страницу
    };
    
    if (loading) return <div className="text-center mt-5"><h4>Загрузка...</h4></div>;
    if (!survey) return <div className="text-center mt-5"><h4>Характеристика не найдена.</h4></div>;

    return (
        <div className="container mt-5">
            {/* Панель управления с кнопкой "Назад" */}
            <div className="d-flex justify-content-start align-items-center mb-4">
                {/* Кнопка "Назад" */}
                <Button variant="secondary" onClick={handleGoBack} className="me-2">Назад</Button>
            </div>
            
            {/* Информация о текущем опросе */}
            <h2 className="text-center mt-4">{survey.title}</h2>
            <p className="text-center">{survey.description}</p>

            {submitMessage && (
    <div className={`alert alert-${submitMessage.type === 'success' ? 'success' : 'danger'} mt-3`}>
        {submitMessage.text}
    </div>
)}

{/* Добавляем кнопку "Больше опросов" после успешного завершения опроса */}
{submitMessage && submitMessage.type === 'success' && (
    <div className="mt-4 text-center">
        <Button variant="link" onClick={() => window.location.href = '/'}>
            Больше характеристик
        </Button>
    </div>
)}
            <div className="mt-4">
                {survey.questions && survey.questions.length > 0 ? (
                    survey.questions.map((question, index) => (
                        <div key={index} className="mb-4">
                            <h2>{index + 1}. {question.text}</h2>
                            {question.options && question.options.length > 0 ? (
                                question.options.map((option, optionIndex) => (
                                    <div className="form-check" key={optionIndex}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option.value}
                                            id={`option-${index}-${optionIndex}`}
                                            onChange={() => handleResponseChange(index, option.value)}
                                        />
                                        <label className="form-check-label" htmlFor={`option-${index}-${optionIndex}`}>
                                            {option.text}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">Нет доступных вариантов для этого вопроса.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-muted">Нет доступных вопросов для этой характеристики.</p>
                )}

                {/* Кнопка отправки */}
                <Button variant="primary" onClick={handleSubmit}>Отправить</Button>
            </div>
        </div>
    );
};

export default SurveyPage;

