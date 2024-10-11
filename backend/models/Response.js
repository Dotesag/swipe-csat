const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    survey: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'userid' },
    answers: [
        {
            questionText: { type: String, required: true },
            answerText: { type: String, required: true },
            value: { type: Number, required: true }, // Используйте value вместо score
        }
    ],
}, { timestamps: true });

const ResponseModel = mongoose.model('Response', responseSchema);
module.exports = ResponseModel;