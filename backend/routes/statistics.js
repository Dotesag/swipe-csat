const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey'); // Предположим, что у вас есть модель Survey

// Получение статистики опросов
router.get('/surveys/:id/stats', async (req, res) => {
    try {
        const statistics = await Survey.aggregate([
            {
                $group: {
                    _id: '$title',
                    totalScore: { $sum: '$score' }, // Предположим, что у вас есть поле score
                    responseCount: { $count: {} }
                }
            },
            {
                $project: {
                    title: '$_id',
                    totalScore: 1,
                    responseCount: 1
                }
            }
        ]);

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;