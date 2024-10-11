import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { getProductById, addReview, updateRating, getSurveysByProductId } from './api';
import StarRating from './StarRating';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageWithFallback from './ImageWithFallback';

const ProductPage = () => {
    const { id: productId } = useParams(); 
    const navigate = useNavigate(); // Добавляем navigate
    const [product, setProduct] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [surveys, setSurveys] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productData = await getProductById(productId);
                setProduct(productData);
                setUserRating(productData.userRating || null);
                const surveysData = await getSurveysByProductId(productId);
                setSurveys(getRandomSurveys(surveysData)); // Выбираем случайные опросы
            } catch (error) {
                console.error('Error fetching product data:', error);
                toast.error('Ошибка загрузки данных продукта.'); // Добавлено уведомление об ошибке
            }
        };
        fetchProductData();
    }, [productId]);

    const getRandomSurveys = (allSurveys) => {
        const shuffled = [...allSurveys].sort(() => 0.5 - Math.random()); // Перемешиваем массив
        return shuffled.slice(0, 4); // Берем первые 4 элемента
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const review = {
            userId: 'guest',
            comment: reviewText,
        };

        try {
            await addReview(productId, review);
            setReviewText('');
            toast.success('Спасибо, ваш отзыв добавлен!');
            const updatedProduct = await getProductById(productId);
            setProduct(updatedProduct);
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('Ошибка при добавлении отзыва.');
        }
    };

    const handleRatingUpdate = async (newRating) => {
        const existingRating = localStorage.getItem('productRating_' + productId);

        if (existingRating) {
            toast.error('Вы уже выставили рейтинг этому продукту.');
            return;
        }

        const ratingData = {
            userId: 'guest',
            rating: newRating,
        };

        try {
            await updateRating(productId, ratingData);
            setUserRating(newRating);
            localStorage.setItem('productRating_' + productId, newRating);
            toast.success('Спасибо, ваш рейтинг учтен!');
            const updatedProduct = await getProductById(productId);
            setProduct(updatedProduct);
        } catch (error) {
            console.error('Error updating rating:', error);
            toast.error('Ошибка при обновлении рейтинга. Пожалуйста, попробуйте еще раз.');
        }
    };

    const handleRate = (newRating) => {
        if (userRating === null || userRating !== newRating) {
            handleRatingUpdate(newRating);
        }
        setUserRating(newRating);
    };

    useEffect(() => {
        const storedRating = localStorage.getItem('productRating_' + productId);
        if (storedRating) {
            setUserRating(Number(storedRating));
        }
    }, [productId]);

    if (!product) return <div className="text-center mt-5">Загрузка...</div>;

    return (
        <div className="container mt-4">
            {/* Кнопка "На главную" */}
            <div className="text-center mb-4">
                <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('/')} // Обработчик для навигации на главную страницу
                >
                    На главную
                </button>
            </div>

            <h1 className="text-center">{product.name}</h1>
            <div className="text-center mb-4">
                <ImageWithFallback 
                    src={`http://localhost:5000/${product.image}`} 
                    alt={product.name} 
                    fallbackSrc="/placeholder-image.jpg"
                    className="img-fluid rounded shadow-lg"
                />
            </div>
            <p className="lead">{product.description}</p>
            <h2>Средний рейтинг: <strong>{product.averageRating.toFixed(1)}</strong> ({product.ratings.length || 0} голосов)</h2>

            <h3>Оценить продукт</h3>
            <StarRating
                rating={userRating || 0}
                onRate={handleRate}
            />

            <h3 className="mt-4">Характеристики</h3>
            <div className="list-group mb-4">
                {surveys.map((survey) => (
                    <a href={survey.url} key={survey._id} className="list-group-item list-group-item-action">
                        <h4>{survey.title}</h4>
                        <p>{survey.description}</p>
                    </a>
                ))}
            </div>
            <h3>Добавить отзыв</h3>
            <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                        className="form-control"
                        rows="4"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Добавить отзыв</button>
            </form>

            <h2 className="mt-4">Отзывы:</h2>
            {product.reviews.length === 0 ? (
                <p>Отзывов пока нет.</p>
            ) : (
                <ul className="list-unstyled">
                    {product.reviews.map((review) => (
                        <li key={review._id} className="mb-3 p-3 border rounded shadow-sm">
                            <p>{review.comment}</p>
                        </li>
                    ))}
                </ul>
            )}

            <ToastContainer />
        </div>
    );
};

export default ProductPage;
