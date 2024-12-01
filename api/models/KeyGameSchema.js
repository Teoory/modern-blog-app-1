const mongoose = require('mongoose');
const { model } = mongoose;

const KeyGameSchema = new mongoose.Schema({
    gameNumber: {
        type: Number,
        required: true
    },
    correctAnswer: {
        type: [Number],
        required: true
    },
    clues: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    questionDate: {
        type: Date,
        default: Date.now
    }
});

const KeyGameModel = model('KeyGame', KeyGameSchema);

module.exports = KeyGameModel;