// create routes
const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const Survey = require('../models/Survey');
const User = require('../models/User');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Настройка multer

// Создать продукт
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin' && user.role !== 'productOwner') {
        return res.status(403).json({ error: 'Access denied: insufficient privileges' });
    }
    const { name, description } = req.body;
    const image = req.file ? req.file.path : null; // Путь к загруженному изображению

    if (!name || !description || !image) {
        return res.status(400).json({ error: 'Name, description, and image are required.' });
    }

    try {
        const product = new Product({ name, description, image, owner:user._id });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Server error');
    }
});

// Получить все продукты
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Получить продукты пользователя
router.get('/my',authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (user.role == 'admin') {
            products = await Product.find();
        }
        else{
            products = await Product.find({owner: req.user.userId});
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Получить продукт по ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        const totalVotes = product.ratings.length;
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Добавить отзыв к продукту
router.post('/:id/reviews', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const review = req.body;
        product.reviews.push(review); // Добавляем только комментарий
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Обновить рейтинг продукта
router.post('/:id/ratings', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const rating = req.body;

        if (rating.rating < 1 || rating.rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        product.ratings.push(rating); // Добавляем только рейтинг
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Обновить рейтинг продукта (PATCH)
router.patch('/:id/ratings', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Извлекаем userId и rating из объекта rating
        const { userId, rating } = req.body.rating; // Извлекаем userId и rating

        // Проверяем, что rating в правильном диапазоне
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
        }

        // Добавляем рейтинг
        product.ratings.push({ userId, rating }); // Добавляем рейтинг с userId
        await product.save(); // Сохраняем изменения

        res.status(200).json(product); // Отправляем ответ
    } catch (error) {
        console.error('Error updating rating:', error); // Логируем ошибку
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Обновить продукт
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {

    const user = await User.findById(req.user.userId);

    const { name, description } = req.body;
    const image = req.file ? req.file.path : null; // Путь к загруженному изображению

    try {
        const product = await Product.findById(req.params.id);
        if (user.role == 'user' || (user.role == 'productOwner' && product.owner.toString() != user._id)) {
            return res.status(403).json({ error: 'Access denied: insufficient privileges' });
        }
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Обновляем поля продукта
        product.name = name || product.name;
        product.description = description || product.description;
        if (image) {
            product.image = image; // Если новое изображение загружено, обновляем путь
        }

        await product.save();
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId);
    try {
        const product = await Product.findById(req.params.id);
        if (user.role == 'user' || (user.role == 'productOwner' && product.owner.toString() != user._id) ) {
            return res.status(403).json({ error: 'Access denied: insufficient privileges' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Удаляем связанные опросы
        await Survey.deleteMany({ product: product._id }); // Удаляем все опросы, связанные с продуктом
        
        // Удаляем продукт
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product successfully deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;