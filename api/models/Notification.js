const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const NotificationSchema = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    type: {
        type: String,
        enum: ['Yorum', 'superlike', 'share'], // Bildirim türleri
        required: true
    },
    isRead: {
        type: Boolean,
        default: false // Varsayılan olarak okunmamış olarak işaretlenir
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NotificationModel = model('Notification', NotificationSchema);

module.exports = NotificationModel;