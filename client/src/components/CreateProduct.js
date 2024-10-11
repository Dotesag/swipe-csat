import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar'; // Импортируем компонент бокового меню
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null); // Состояние для хранения изображения
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для гамбургер-меню
    const [error, setError] = useState(null); // Состояние для хранения ошибок

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (image) {
            formData.append('image', image); // Добавляем изображение в FormData
        }

        try {
            // Получение токена из локального хранилища
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/products', 
                formData, 
                { 
                    headers: { 
                        Authorization: `${token}`,
                        'Content-Type': 'multipart/form-data' // Указываем, что отправляем форму с файлами
                    } 
                }
            );
            // Очистка полей ввода
            setName('');
            setDescription('');
            setImage(null);
            setError(null); // Сбрасываем ошибку
            navigate('/my-products');
        } catch (error) {
            console.error('Error adding product:', error);
            setError('Ошибка при добавлении продукта. Попробуйте еще раз.'); // Устанавливаем сообщение об ошибке
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Переключение меню

    return (
        <div className="container mt-4">
            <h2>Добавить продукт</h2>
            <button className="btn btn-light d-md-none mb-3" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} /> {isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </button>
            <div className="d-flex flex-wrap">
                <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} /> {/* Используем компонент бокового меню */}
                <div className="flex-grow-1 p-3">
                    {error && <div className="alert alert-danger">{error}</div>} {/* Отображение ошибки */}
                    <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
                        <div className="mb-3">
                            <label className="form-label">Название продукта:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                maxLength={19} // Ограничение на 30 символов
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Описание продукта:</label>
                            <textarea
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                maxLength={30} // Ограничение на 200 символов
                                rows={4} // Количество строк
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Изображение продукта:</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Добавить продукт</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
