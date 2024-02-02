const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MailVerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Doğrulama kodu 1 saat sonra otomatik olarak silinecek
    }
});

const MailVerificationModel = model('MailVerification', MailVerificationSchema);

module.exports = MailVerificationModel;