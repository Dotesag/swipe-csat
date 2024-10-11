import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const SurveysProducts = () => {
    const { productId } = useParams(); // Получаем идентификатор продукта из параметров маршрута
    const [surveys, setSurveys] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredSurveys, setFilteredSurveys] = useState([]); // Фильтрованные опросы
    const [selectedProduct, setSelectedProduct] = useState(productId); // Выбранный продукт
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/surveys');
                setSurveys(response.data);
                setFilteredSurveys(response.data.filter(survey => survey.product && survey.product._id === productId)); // Фильтруем по продукту
            } catch (error) {
                console.error('Error fetching surveys:', error);
            }
        };
    
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
    
        fetchSurveys();
        fetchProducts();
    }, [productId]);

    const getProductName = (productId) => {
        const product = products.find(prod => prod._id === productId._id);
        return product ? product.name : 'Неизвестный продукт';
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/surveys/${id}`, {
                headers: { Authorization: `${token}` }
            });
            setSurveys(surveys.filter(survey => survey._id !== id));
            setFilteredSurveys(filteredSurveys.filter(survey => survey._id !== id)); // Обновляем фильтрованные опросы
        } catch (error) {
            console.error('Error deleting survey:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Список характеристик для товара: {getProductName({ _id: productId })}</h2>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <div className="flex-grow-1 p-3">
                <button 
                        className="btn btn-primary mb-3" 
                        onClick={() => navigate(-1)} // Функция для возврата на предыдущую страницу
                    >
                        Назад
                    </button>
                    <br/>
                    <Link to="/add-survey" className="btn btn-primary mb-3">Создать новую характеристику</Link>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Ссылка</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSurveys.map(survey => (
                                <tr key={survey._id}>
                                    <td>{survey.title}</td>
                                    <td>{survey.description}</td>
                                    <td>{survey.url}</td>
                                    <td className='list-group ms-3'>
                                        <Link to={`/edit-survey/${survey._id}`} className="btn btn-warning">Редактировать</Link>
                                        <Link to={`/surveys/${survey._id}/questions`} className="btn btn-info">Вопросы</Link>
                                        <Link to={`/surveys/${survey._id}/stats`} className="btn btn-secondary">Посмотреть статистику</Link> {/* Новая кнопка */}
                                        <button onClick={() => handleDelete(survey._id)} className="btn btn-danger">Удалить</button>
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

export default SurveysProducts;
