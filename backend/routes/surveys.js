const express = require('express');
const Survey = require('../models/Survey');
const Response = require('../models/Response'); // Импортируйте вашу модель Response
const ResponseModel = require('../models/Response');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware'); // Защита маршрутов
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');


// Создание опроса
router.post('/', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user || (user.role !== 'admin' && user.role !== 'productOwner')) {
        return res.status(403).json({ error: 'Access denied: insufficient privileges' });
    }

    const { title, description, product } = req.body;

    try {
        const survey = new Survey({ title, description, product });
        await survey.save();

        survey.url = `http://localhost:3000/survey/${survey._id}`; // Сохраняем сгенерированный URL
        await survey.save(); // Сохраняем изменения в опрос

        res.status(201).json({ survey, url: survey.url });
    } catch (error) {
        console.error('Error creating survey:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Сохранение ответов на опрос
router.post('/:id/responses', async (req, res) => {
    const { answers, userid } = req.body; // Извлекаем данные из тела запроса

    // Проверка на наличие ответов
    if (!answers || !answers.length) {
        return res.status(400).json({ error: 'No answers provided' });
    }

    let userId;
    if (userid === 'guest') {
        userId = new mongoose.Types.ObjectId("67071671284273b2fb374e82"); // Гость получает стандартный ID
    } else {
        userId = userid;
    }

    console.log(userId);

    try {
        const response = new ResponseModel({
            survey: req.params.id, // Связываем с текущим опросом
            userid: userId,
            answers: answers, // Сохраняем ответы
        });

        await response.save(); // Сохраняем ответ в базе данных
        res.status(201).json(response);
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(500).json({ error: 'Failed to save response' });
    }
});

// Получение опросов по продукту
router.get('/product/:productId', async (req, res) => {
    try {
        const surveys = await Survey.find({ product: req.params.productId });
        res.json(surveys);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Получение всех опросов
router.get('/', async (req, res) => {
    try {
        const surveys = await Survey.find().populate('product'); // Пополняем данные о продукте
        res.json(surveys);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Получение опросов текущего пользователя
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (user.role == 'admin') {
            const surveys = await Survey.find().populate('product');
            return res.json(surveys); // Возвращаем все опросы для администратора
        } else {
            const products = await Product.find({ owner: req.user.userId });
            const productIds = products.map(product => product._id);
            const surveys = await Survey.find({ product: { $in: productIds } }).populate('product');
            return res.json(surveys); // Возвращаем опросы, связанные с продуктами пользователя
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Получение опроса по ID
router.get('/:id', async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id).populate('questions');
        if (!survey) {
            return res.status(404).send('Survey not found');
        }
        res.json(survey);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Обновление опроса
router.put('/:id', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId);
    const survey = await Survey.findById(req.params.id);

    if (user.role === 'user' || (user.role === 'productOwner' && survey.product.owner.toString() !== user._id)) {
        return res.status(403).json({ error: 'Access denied: insufficient privileges' });
    }

    const { title, description, product, questions } = req.body;
    try {
        const updatedSurvey = await Survey.findByIdAndUpdate(req.params.id, { title, description, product, questions }, { new: true });
        res.json(updatedSurvey);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Удаление опроса
router.delete('/:id', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.userId);
    const survey = await Survey.findById(req.params.id);

    if (user.role === 'user' || (user.role === 'productOwner' && survey.product.owner.toString() !== user._id)) {
        return res.status(403).json({ error: 'Access denied: insufficient privileges' });
    }

    try {
        await Survey.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Survey deleted' });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Генерация URL для опроса
router.post('/generate-url/:id', authMiddleware, async (req, res) => {
    try {
        const survey = await Survey.findById(req.params.id);
        if (!survey) return res.status(404).json({ message: 'Survey not found' });

        // Генерация URL
        const uniqueUrl = `${req.protocol}://${req.get('host')}/survey/${survey._id}`;
        survey.url = uniqueUrl;
        await survey.save();

        res.json({ url: uniqueUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Получение статистики по опросу
router.get('/:id/stats', async (req, res) => {
    try {
        const surveyId = req.params.id;

        const survey = await Survey.findById(surveyId).populate('questions');
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        const responses = await Response.find({ survey: surveyId });

        // Статистика по вопросам
        const questionStats = survey.questions.map(question => {
            const answersForQuestion = responses.map(response =>
                response.answers.find(ans => ans.questionText === question.text)
            ).filter(Boolean); // Убираем ответы, которые не соответствуют вопросу

            const answerCounts = {};

            answersForQuestion.forEach(ans => {
                if (ans) {
                    answerCounts[ans.answerText] = {
                        count: (answerCounts[ans.answerText]?.count || 0) + 1,
                        value: ans.value,
                    };
                }
            });

            return {
                questionText: question.text,
                answersCount: answersForQuestion.length,
                averageScore: answersForQuestion.reduce((sum, ans) => sum + ans.value, 0) / answersForQuestion.length || 0,
                answerCounts,
            };
        });

        const stats = {
            title: survey.title,
            responsesCount: responses.length,
            questionStats,
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching survey stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
