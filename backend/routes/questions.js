const express = require('express');
const Question = require('../models/Question');
const Survey = require('../models/Survey');
const User = require('../models/User');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware'); // Защита маршрутов
// const router = express.Router();
const router = express.Router({ mergeParams: true });

// Создание вопроса
router.post('/', authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.userId);
    const survey = await Survey.findById(req.params.surveyId);

    if (user.role === 'user' || (user.role === 'productOwner' && survey.product.owner.toString() !== user._id)) {
        return res.status(403).json({ error: 'Access denied: insufficient privileges' });
    }

    const { text, options } = req.body;
    const surveyId = req.params.surveyId;
    try {
        const question = new Question({ text, options, survey: surveyId });
        await question.save();
        await Survey.findByIdAndUpdate(surveyId, { $push: { questions: question._id } });
        res.status(201).json(question);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Получение всех вопросов
router.get('/', async (req, res) => {
    const surveyId = req.params.surveyId;
    try {
        const questions = await Question.find({ survey: surveyId }).populate('survey');
        res.json(questions);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Получение вопроса по ID
router.get('/:questionId', async (req, res) => {
    const surveyId = req.params.surveyId; // Получение surveyId из URL
    const questionId = req.params.questionId; // Получение questionId из URL
    try {
        const question = await Question.findOne({ _id: questionId, survey: surveyId }).populate('survey');
        if (!question) {
            return res.status(404).send('Question not found');
        }
        res.json(question);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Обновление вопроса
router.put('/:questionId', authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.userId);
    const survey = await Survey.findById(req.params.surveyId);

    if (user.role === 'user' || (user.role === 'productOwner' && survey.product.owner.toString() !== user._id)) {
        return res.status(403).json({ error: 'Access denied: insufficient privileges' });
    }

    const { text, options } = req.body;
    const surveyId = req.params.surveyId; // Получение surveyId из URL
    const questionId = req.params.questionId; // Получение questionId из URL
    try {
        const question = await Question.findOneAndUpdate({ _id: questionId, survey: surveyId }, { text, options }, { new: true });
        if (!question) {
            return res.status(404).send('Question not found');
        }
        res.json(question);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Удаление вопроса
router.delete('/:questionId', authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.userId);
    const survey = await Survey.findById(req.params.surveyId);

    if (user.role === 'user' || (user.role === 'productOwner' && survey.product.owner.toString() !== user._id)) {
        return res.status(403).json({ error: 'Access denied: insufficient privileges' });
    }

    const surveyId = req.params.surveyId; // Получение surveyId из URL
    const questionId = req.params.questionId; // Получение questionId из URL
    try {
        const survey = await Survey.findById(surveyId);
        if (!survey) {
            return res.status(404).send('Survey not found');
        }

        survey.questions.pull(questionId);
        await survey.save();

        const question = await Question.findByIdAndDelete(questionId)
        await Survey.findByIdAndUpdate(surveyId, { $pull: { questions: questionId } });
        if (!question) {
            return res.status(404).send('Question not found');
        }
        res.json({ msg: 'Question deleted' });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
