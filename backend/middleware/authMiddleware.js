const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware для проверки токена
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Сохраняем информацию о пользователе в запросе
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware для проверки ролей
const checkRole = (role) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.userId); // Находим пользователя по ID
            if (user.role !== role) {
                return res.status(403).json({ msg: 'Access denied: insufficient privileges' });
            }
            next();
        } catch (error) {
            res.status(500).json({ msg: 'Server error' });
        }
    };
};

module.exports = { authMiddleware, checkRole };
