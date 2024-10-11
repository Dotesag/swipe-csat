import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar'; // Импортируем компонент бокового меню
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import ImageWithFallback from './ImageWithFallback';

const EditProduct = () => {
    const [product, setProduct] = useState({ name: '', description: '', image: null });
    const { id } = useParams();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для гамбургер-меню

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
                    headers: { Authorization: `${localStorage.getItem('token')}` }
                });
                setProduct({
                    ...response.data,
                    image: response.data.image ? `http://localhost:5000/${response.data.image}` : null
                });
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        if (product.image) {
            formData.append('image', product.image);
        }
        
        try {
            await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
                headers: { 
                    Authorization: `${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data' // Указываем, что отправляем форму с файлами
                }
            });
            navigate('/my-products');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Переключение меню

    return (
        <div className="container mt-4">
            <h2>Редактировать продукт</h2>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} /> {/* Используем компонент бокового меню */}
                <div className="flex-grow-1 p-3">
                <button 
                        className="btn btn-primary mb-3" 
                        onClick={() => navigate(-1)} // Функция для возврата на предыдущую страницу
                    >
                        Назад
                    </button>
                    <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
                        <div className="mb-3">
                            <label className="form-label">Название продукта:</label>
                            <input 
                                type="text" 
                                name="name" 
                                className="form-control" 
                                value={product.name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Описание продукта:</label>
                            <textarea 
                                name="description" 
                                className="form-control" 
                                value={product.description} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Изображение продукта:</label>
                            {product.image && typeof product.image === 'string' && (
                                <div className="mb-3">
                                    <ImageWithFallback 
                                        src={product.image} 
                                        alt={product.name} 
                                        fallbackSrc="/placeholder-image.jpg" // Указываем путь к заглушке
                                        style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
                                    />
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="form-control" 
                                onChange={handleImageChange} 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Обновить продукт</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;