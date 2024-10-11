import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Добавляем useNavigate для перенаправления
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import ImageWithFallback from './ImageWithFallback';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const navigate = useNavigate(); // Хук для навигации

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке продукта');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center mt-4">Загрузка...</div>;
    if (error) return <div className="alert alert-danger mt-4">{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Список категорий</h2>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <div className="flex-grow-1 p-3">
                    <button 
                        className="btn btn-primary mb-3" 
                        onClick={() => navigate(-1)} // Функция для возврата на предыдущую страницу
                    >
                        Назад
                    </button>
                    <div className="card">
                        <ImageWithFallback 
                            src={`http://localhost:5000/${product.image}`}
                            alt={product.name}  
                            fallbackSrc="/placeholder-image.jpg" // Указываем путь к заглушке
                            className="card-img-top"
                            style={{ height: '300px', width: '100%', objectFit: 'contain' }} 
                        />
                        <div className="card-body">
                            <h2 className="card-title">{product.name}</h2>
                            <p className="card-text">{product.description}</p>
                            <h4 className="mt-3">Средний рейтинг: 
                                <span className="badge bg-secondary ms-2">{product.averageRating.toFixed(1)} 
                                </span> 
                                <small className="text-muted">({product.ratings.length} голосов)</small>
                            </h4>
                            <h5 className="mt-4">Отзывы:</h5>
                            <ul className="list-group">
                                {product.reviews.map((review, index) => (
                                    <li key={index} className="list-group-item">
                                        <em>{review.comment}</em>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
