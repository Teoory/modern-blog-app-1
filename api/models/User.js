const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        min: 4,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    }
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;