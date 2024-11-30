const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        min: 6,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please provide a email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    bio: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false 
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        enum: ['admin', 'editor', 'premium', 'master-writer', 'writer', 'user'],
        default: ['user']
    },
    premiumExpiration: {
        type: Date,
        default: Date.now
    },
    userColor: {
        type: String,
        enum: ['gray', 'red', 'blue', 'green', 'cherry', 'orange', 'lime', 'orange2', 'green2', 'yellow', 'orange3', 'blue2', 'blue3', 'pink', 'purple', 'green3'],
        default: 'blue'
    },
    profilePhoto: {
        type: String,
        default: 'https://fiyasko-blog-app.s3.eu-central-1.amazonaws.com/profilePhotos/default.jpg'
    },
    darkMode: {
        type: Boolean,
        default: true
    },
    likedPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    likedTests: [{
        type: Schema.Types.ObjectId,
        ref: 'Test'
    }],
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;