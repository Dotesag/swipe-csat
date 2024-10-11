const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
});

const QuestionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    options: [OptionSchema], // массив вариантов ответов
    survey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
        required: true,
    },
}, {
    timestamps: true, // автоматически добавляет createdAt и updatedAt
});

module.exports = mongoose.model('Question', QuestionSchema);