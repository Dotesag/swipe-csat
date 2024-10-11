import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Импортируем новый компонент
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const EditSurvey = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState({ title: '', description: '', product: '' });
    const [products, setProducts] = useState([]);

    const [isMenuOpen, setIsMenuOpen] = useState(false); // состояние для гамбургер-меню

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // переключение меню

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/surveys/${id}`);
                setSurvey(response.data);
            } catch (error) {
                console.error('Error fetching survey:', error);
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

        fetchSurvey();
        fetchProducts();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSurvey((prevSurvey) => ({ ...prevSurvey, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/surveys/${id}`, survey, {
                headers: { Authorization: `${token}` },
            });
            navigate(`/survey`); // Исправьте путь навигации
        } catch (error) {
            console.error('Error updating survey:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Редактировать характеристику</h2>
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
                            <label className="form-label">Название характеристики</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={survey.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Описание</label>
                            <textarea
                                name="description"
                                className="form-control"
                                value={survey.description}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Продукт</label>
                            <select
                                name="product"
                                className="form-select"
                                value={survey.product} // Измените на 'product'
                                onChange={handleChange}
                                required
                            >
                                <option value="">Выберите продукт</option>
                                {products.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Сохранить</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditSurvey;
