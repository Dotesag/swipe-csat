const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');;

// Регистрация
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Проверка, существует ли пользователь
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Создание нового пользователя
        user = new User({ username, email, password });
        await user.save();

        // Генерация токена
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token }); // Возвращаем токен и статус 201 (создано)
    } catch (error) {
        console.error(error); // Логируем ошибку на сервере
        res.status(500).json({ msg: 'Server error' }); // Возвращаем сообщение об ошибке
    }
});

// Авторизация
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "нет пользоваля" });

        // Сравнение паролей
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "пароль не верный" });

        // Генерация токена
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token }); // Возвращаем токен
    } catch (error) {
        console.error(error); // Логируем ошибку на сервере
        res.status(500).json({ msg: 'Server error' }); // Возвращаем сообщение об ошибке
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Используем id пользователя из декодированного токена
        const user = await User.findById(req.user.userId).select('-password'); // Не возвращаем пароль

        if (!user) {
            return res.status(404).json({ msg: 'Пользователь не найден' });
        }

        // Возвращаем данные о пользователе
        res.json(user);
    } catch (error) {
        console.error(error); // Логируем ошибку на сервере
        res.status(500).json({ msg: 'Server error' }); // Возвращаем сообщение об ошибке
    }
});
router.put('/update', authMiddleware, async (req, res) => {
    const { username, email, password } = req.body;
    if (!email) {
        return res.status(400).json({ msg: 'Email обязателен' });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ msg: 'Пользователь не найден' });

        // Обновляем данные пользователя
        user.username = username || user.username;
        user.email = email || user.email;
        if (password) {
            user.password = password;
        }

        await user.save();
        const user1 = await User.findById(req.user.userId);
        res.status(200).json({ msg: 'Данные успешно обновлены' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ошибка сервера', error: error.message });
    }
});

module.exports = router;
