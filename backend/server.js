const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { OpenAI } = require('openai'); // Импортируем OpenAI
const path = require('path');
require('dotenv').config();

const app = express();

// Подключаем базу данных
connectDB();

// Middleware
app.use(express.json()); // Для обработки JSON-данных
app.use(cors()); // Для разрешения CORS-запросов

// Маршруты
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/surveys', require('./routes/surveys')); 
app.use('/api/surveys/:surveyId/questions', require('./routes/questions')); 
app.use('/api/responses', require('./routes/responses'));
app.use('/api/responses/user', require('./routes/responses'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Пример маршрута для получения опросов
app.get('/api/surveys', async (req, res) => {
    const { product } = req.query; // Получаем параметр product из запроса

    try {
        let surveys;
        if (product) {
            surveys = await Survey.find({ 'product._id': product }); // Фильтрация по продукту
        } else {
            surveys = await Survey.find(); // Если product не указан, возвращаем все опросы
        }
        res.json(surveys);
    } catch (error) {
        console.error('Error fetching surveys:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Инициализация OpenAI с использованием API ключа
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ваш API ключ из файла .env
});

// Обработка POST запросов к /api/chatgpt
app.post('/api/chatgpt', async (req, res) => {
    const { message } = req.body; // Получаем сообщение от клиента
  
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Используйте "gpt-4" или другую модель, если требуется
        messages: [{ role: "user", content: message }],
      });
  
      const chatResponse = completion.choices[0].message.content;
      res.json({ message: chatResponse }); // Возвращаем ответ ChatGPT клиенту
    } catch (error) {
      console.error('Ошибка при запросе к OpenAI:', error);
      res.status(500).json({ error: 'Что-то пошло не так' });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
