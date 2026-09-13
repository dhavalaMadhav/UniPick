const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
    stream: {
        type: String,
        required: true,
        enum: ['science', 'commerce', 'arts', 'engineering']
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            text: String,
            weights: {
                type: Map,
                of: Number
            }
        }]
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
