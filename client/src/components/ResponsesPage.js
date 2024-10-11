import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container } from 'react-bootstrap';

const ResponsesPage = () => {
    const [products, setProducts] = useState([]); // Изменено с categories на products
    const [surveys, setSurveys] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedSurvey, setSelectedSurvey] = useState('');
    const [responses, setResponses] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Получение продуктов
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await fetch('http://localhost:5000/api/products/my',
                    { headers: { Authorization: `${token}` } }
                ); // Предполагаем, что есть такой эндпоинт
                if (!response.ok) throw new Error('Ошибка загрузки продуктов');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    // Получение опросов по продукту
    useEffect(() => {
        const fetchSurveys = async () => {
            if (selectedProduct) {
                try {
                    const response = await fetch(`http://localhost:5000/api/surveys/product/${selectedProduct}`);
                    if (!response.ok) throw new Error('Ошибка загрузки опросов');
                    const data = await response.json();
                    setSurveys(data);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchSurveys();
    }, [selectedProduct]);

    // Получение ответов по выбранному опросу
    useEffect(() => {
        const fetchResponses = async () => {
            if (selectedSurvey) {
                try {
                    const response = await fetch(`http://localhost:5000/api/responses/${selectedSurvey}`);
                    if (!response.ok) throw new Error('Ошибка загрузки ответов');
                    const data = await response.json();
                    setResponses(data);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchResponses();
    }, [selectedSurvey]);

    return (
        <div className="container mt-4">
            <h2>Панель управления</h2>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <div className="flex-grow-1 p-3">
                    <div className="mb-4">
                        <label htmlFor="productSelect">Выберите продукт:</label>
                        <select
                            id="productSelect"
                            className="form-select"
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            <option value="">Выберите продукт</option>
                            {products.map((product) => (
                                <option key={product._id} value={product._id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="surveySelect">Выберите характеристику:</label>
                        <select
                            id="surveySelect"
                            className="form-select"
                            onChange={(e) => setSelectedSurvey(e.target.value)}
                        >
                            <option value="">Выберите характеристику</option>
                            {surveys.map((survey) => (
                                <option key={survey._id} value={survey._id}>
                                    {survey.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <Container className="mt-5">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Характеристика</th>
                            <th>Вопросы</th>
                            <th>Ответы</th>
                            <th>Баллы</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responses.map((response) => (
                            <tr key={response._id}>
                                <td>{new Date(response.createdAt).toLocaleString()}</td>
                                <td>{response.survey.title}</td>
                                <td>
                                    <ul>
                                        {response.answers.map((answer, index) => (
                                            <li key={index}>
                                                {answer.questionText} {/* Текст вопроса */}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        {response.answers.map((answer, index) => (
                                            <li key={index}>
                                                {answer.answerText || 'Нет ответа'} {/* Текст ответа */}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        {response.answers.map((answer, index) => (
                                            <li key={index}>
                                                {answer.value || 0} {/* Значение (балл) ответа */}
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
