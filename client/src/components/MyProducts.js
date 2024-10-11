import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import ImageWithFallback from './ImageWithFallback';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/my', {
                headers: { Authorization: `${localStorage.getItem('token')}` }
            });
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            setError('Ошибка при загрузке продуктов');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: { Authorization: `${localStorage.getItem('token')}` }
            });
            setProducts(products.filter(product => product._id !== id));
        } catch (err) {
            setError('Ошибка при удалении продукта');
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Мои продукты</h2>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                <div className="flex-grow-1 p-3">
                    <Link to="/create-product" className="btn btn-primary mb-3">Добавить новый продукт</Link>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Изображение</th>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <ImageWithFallback 
                                            src={`http://localhost:5000/${product.image}`} 
                                            alt={product.name}
                                            fallbackSrc="/placeholder-image.jpg" // Указываем путь к заглушке
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <Link to={`/edit-product/${product._id}`} className="btn btn-sm btn-info mb-1">Редактировать</Link>
                                            <Link to={`/products/detail/${product._id}`} className="btn btn-sm btn-primary mb-1">Статистика</Link>
                                            <Link to={`/surveys/product/${product._id}`} className="btn btn-sm btn-secondary mb-1">Характеристики</Link>
                                            <button onClick={() => handleDelete(product._id)} className="btn btn-sm btn-danger">Удалить</button>
                                        </div>
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

export default MyProducts;
