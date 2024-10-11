const mongoose = require('mongoose');
const Survey = require('./Survey'); //

const RatingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    }
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [ReviewSchema],
    ratings: [RatingSchema], // Добавляем массив для хранения рейтингов
    averageRating: {
        type: Number,
        default: 0,
    },
    surveys: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey',
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId, // Ссылка на пользователя
        ref: 'User', // Имя модели пользователя
        required: true // Это поле обязательно
    }
}, {
    timestamps: true,
});

// Метод для расчета среднего рейтинга
ProductSchema.methods.calculateAverageRating = function () {
    if (this.ratings.length > 0) {
        const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        this.averageRating = total / this.ratings.length;
    } else {
        this.averageRating = 0; // Если нет рейтингов, устанавливаем 0
    }
};

// Middleware для пересчета среднего рейтинга перед сохранением
ProductSchema.pre('save', function(next) {
    this.calculateAverageRating();
    next();
});



const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
