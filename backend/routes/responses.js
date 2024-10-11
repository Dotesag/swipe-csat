const express = require('express');
const Response = require('../models/Response');
const Question = require('../models/Question'); // Импортируем модель Question
const router = express.Router();

router.get('/:surveyId', async (req, res) => {
    try {
        const responses = await Response.find({ survey: req.params.surveyId }).populate('survey');
        res.json(responses);
    } catch (error) {
        console.error('Error fetching responses:', error);
        res.status(500).json({ message: 'Error fetching responses' });
    }
});

// Сохранение ответа
router.post('/:id/responses', async (req, res) => {
    try {
        const { surveyId, answers } = req.body; // Извлекаем данные из тела запроса
        const newResponse = new Response({
            survey: surveyId,
            answers: answers, // Используем 'answers' вместо 'responses'
        });
        await newResponse.save(); // Сохраняем ответ в базе данных
        res.status(201).json(newResponse); // Возвращаем созданный ответ
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ message: 'Error saving response' });
    }
});

// Получение всех ответов пользователя
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; // Извлекаем userId из параметров маршрута
        const responses = await Response.find({ userid: userId }).populate('survey'); // Поиск всех ответов по userid и популяция опросов
        res.json(responses);
    } catch (error) {
        console.error('Error fetching user responses:', error);
        res.status(500).json({ message: 'Error fetching user responses' });
    }
});

module.exports = router;
