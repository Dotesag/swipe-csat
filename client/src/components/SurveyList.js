import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredSurveys, setFilteredSurveys] = useState([]); // Фильтрованные опросы
    const [selectedProduct, setSelectedProduct] = useState(''); // Выбранный продукт
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/surveys/my', {
                    headers: { Authorization: `${token}` }
                });
                setSurveys(response.data);
                setFilteredSurveys(response.data); // Изначально отображаем все опросы
            } catch (error) {
                console.error('Error fetching surveys:', error);
            }
        };
    
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/products/my', {
                    headers: { Authorization: `${token}` }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
    
        fetchSurveys();
        fetchProducts();
    }, []);
    

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

    // Обработчик изменения выбранного продукта
    const handleProductFilterChange = (e) => {
        const selected = e.target.value;
        setSelectedProduct(selected);
        
        if (selected === '') {
            setFilteredSurveys(surveys); // Если не выбран продукт, показываем все
        } else {
            // Сравниваем с `survey.product._id`, если `survey.product` — это объект
            setFilteredSurveys(surveys.filter(survey => survey.product && survey.product._id === selected));
        }
    };
    

    return (
        <div className="container mt-4">
            <h2>Список характеристик</h2>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <div className="flex-grow-1 p-3">
                    <Link to="/add-survey" className="btn btn-primary mb-3">Создать новый характеристик</Link>

                    {/* Добавляем фильтр по товарам */}
                    <div className="mb-3">
                        <label htmlFor="productFilter" className="form-label">Фильтр по продуктам:</label>
                        <select
                            id="productFilter"
                            className="form-select"
                            value={selectedProduct}
                            onChange={handleProductFilterChange}
                        >
                            <option value="">Все продукты</option>
                            {products.map(product => (
                                <option key={product._id} value={product._id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Ссылка</th>
                                <th>Продукт</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSurveys.map(survey => (
                                <tr key={survey._id}>
                                    <td>{survey.title}</td>
                                    <td>{survey.description}</td>
                                    <td>{survey.url}</td>
                                    <td>
                                        {getProductName(survey.product)}
                                    </td>
                                    <td className='list-group ms-3'>
                                        <Link to={`/edit-survey/${survey._id}`} className="btn btn-warning">Редактировать</Link>
                                        <Link to={`/surveys/${survey._id}/questions`} className="btn btn-info">Вопросы</Link>
                                        <Link to={`/surveys/${survey._id}/stats`} className="btn btn-secondary">Посмотреть статистику</Link> {/* Новая кнопка */}
    <                                   button onClick={() => handleDelete(survey._id)} className="btn btn-danger">Удалить</button>
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

export default SurveyList;
