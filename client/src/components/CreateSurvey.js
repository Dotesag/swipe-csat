import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Импортируем новый компонент
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const CreateSurvey = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [product, setProduct] = useState(''); // Изменено на product
    const [products, setProducts] = useState([]); // Состояние для хранения продуктов
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // состояние для гамбургер-меню
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // переключение меню

    // Функция для получения продуктов
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get('http://localhost:5000/api/products/my',
                    { headers: { Authorization: `${token}` } }
                ); // Предполагаем, что есть такой эндпоинт
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); 
            await axios.post('http://localhost:5000/api/surveys', 
                { title, description, product }, // Передаем product
                { headers: { Authorization: `${token}` } }
            );
            navigate('/survey');
        } catch (error) {
            console.error('Error creating survey:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Создать новую характеристику</h2>
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
                            <label className="form-label">Название</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                maxLength={50} // Ограничение на 50 символов
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Описание</label>
                            <textarea
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                maxLength={100} // Ограничение на 200 символов
                                rows={4} // Количество строк
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Продукт</label>
                            <select
                                className="form-select"
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                required
                            >
                                <option value="" disabled>Выберите продукт</option>
                                {products.map((prod) => (
                                    <option key={prod._id} value={prod._id}>{prod.name}</option> // Предполагаем, что у продукта есть поле name
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Создать характеристику</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateSurvey;
