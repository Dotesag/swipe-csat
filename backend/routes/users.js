const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

// Получение списка всех пользователей (доступно для админа)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Получение информации о конкретном пользователе
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Обновление информации о пользователе
router.put('/:id', authMiddleware, async (req, res) => {
    const { username, email, role } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { username, email, role }, { new: true });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Обновление роли пользователя (доступно для админа)
router.patch('/:id/role', authMiddleware, async (req, res) => {
    const { role } = req.body; // ожидание, что роль передается в теле запроса
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Удаление пользователя (доступно для админа)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json({ msg: 'User deleted' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { username, email, role, password } = req.body; // ожидание, что эти данные передаются в теле запроса
    try {
        const newUser = new User({ username, email, role,password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
