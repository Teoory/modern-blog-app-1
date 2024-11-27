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
    tags: {
        type: [String],
        enum: ['admin', 'moderator', 'editor', 'master-writer', 'writer', 'user'],
        default: ['user']
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