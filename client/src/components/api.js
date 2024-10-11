// Создайте файл src/api.js для взаимодействия с сервером:
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // URL вашего сервера

export const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};

export const createProduct = async (product) => {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
};

export const getReviews = async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
};

export const addReview = async (id, review) => {
    const response = await axios.post(`${API_URL}/products/${id}/reviews`, review);
    return response.data;
};

export const updateRating = async (productId, rating) => {
    const response = await axios.patch(`http://localhost:5000/api/products/${productId}/ratings`, { rating });
    return response.data;
};

export const getSurveysByProductId = async (productId) => {
    const response = await axios.get(`${API_URL}/surveys/product/${productId}`);
    return response.data;
};