// update survey model replace caterory to product
const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    }],
    url: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Survey', SurveySchema);