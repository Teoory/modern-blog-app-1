const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const CommentSchema = new mongoose.Schema({
    content: {
        type: String, 
        required: true
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    post: {
        type: Schema.Types.ObjectId, 
        ref: 'Post'
    },
    test: {
        type: Schema.Types.ObjectId, 
        ref: 'Test'
    },
    createdAt: {
        type: Date, 
        default: Date.now
    }
});

const CommentModel = model('Comment', CommentSchema);

module.exports = CommentModel;