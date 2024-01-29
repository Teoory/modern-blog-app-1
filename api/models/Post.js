const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PostSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    cover:String,
    author:{
        type:Schema.Types.ObjectId, 
        ref:'User'
    },
    likes:[{
        type:Schema.Types.ObjectId, 
        ref:'User'
    }],
    superlikes:[{
        type:Schema.Types.ObjectId, 
        ref:'User'
    }],
    PostTags: {
        type: String,
        enum: ['Gündem', 'Spor', 'Teknoloji', 'Eğitim', 'Sağlık', 'Ekonomi', 'Sanat', 'Yaşam', 'Seyahat', 'Kültür', 'Bilim', 'Tarih', 'Magazin', 'Otomobil', 'Yemek', 'Kadın', 'Aile', 'Çocuk', 'Astroloji', 'Hava Durumu', 'Oyun', 'Dizi', 'Film', 'Müzik', 'Kitap', 'Diğer'],
        default: 'Gündem'
    },
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;