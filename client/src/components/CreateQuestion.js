import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Импортируем новый компонент
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import ChatGptDialog from './ChatGptDialog';

const CreateQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [options, setOptions] = useState([{ text: '', value: 0 }]);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // состояние для гамбургер-меню

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // переключение меню

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index][event.target.name] = event.target.value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { text: '', value: 0 }]);
    };

    const removeOption = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); 
            await axios.post(`http://localhost:5000/api/surveys/${id}/questions`, { text, options, survey: id },{ headers: { Authorization: `${token}` } });
            navigate(`/surveys/${id}/questions`);
        } catch (error) {
            console.error('Error creating question:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Добавить новый вопрос</h2>
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
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Текст вопроса</label>
                            <input
                                type="text"
                                className="form-control"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            />
                        </div>
                        {options.map((option, index) => (
                            <div key={index} className="mb-3">
                                <label className="form-label">Вариант ответа {index + 1}</label>
                                <input
                                    type="text"
                                    name="text"
                                    className="form-control"
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(index, e)}
                                    required
                                />
                                <label className="form-label">Баллы</label>
                                <input
                                    type="number"
                                    name="value"
                                    className="form-control"
                                    value={option.value}
                                    onChange={(e) => handleOptionChange(index, e)}
                                    min="1" // Баллы должны быть больше 0
                                    required
                                />
                                <button type="button" className="btn btn-danger mt-2" onClick={() => removeOption(index)}>Удалить вариант</button>
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary" onClick={addOption}>Добавить вариант ответа</button>
                        <button type="submit" className="btn btn-primary">Добавить вопрос</button>
                    </form>
                </div>
            </div>
            <ChatGptDialog/>
        </div>
    );
};

export default CreateQuestion;
