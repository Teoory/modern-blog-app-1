const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TestSchema = new Schema(
  {
    title: { type: String, required: true },
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
    totalViews: {
        type: Number,
        default: 0
    },
    TestTags: {
        type: String,
        enum: ['Gündem', 'Spor', 'Teknoloji', 'Eğitim', 'Sağlık', 'Ekonomi', 'Sanat', 'Yaşam', 'Seyahat', 'Kültür', 'Bilim', 'Tarih', 'Magazin', 'Otomobil', 'Yemek', 'Kadın', 'Aile', 'Çocuk', 'Astroloji', 'Hava Durumu', 'Oyun', 'Dizi', 'Film', 'Müzik', 'Kitap', 'Diğer'],
        default: 'Diğer'
    },
    summary: { type: String, required: true },
    cover: { type: String },
    questions: [
      {
        questionText: { type: String, required: true },
        image: { type: String },
        answers: [
          {
            answerText: { type: String, required: true },
            score: { type: Number, required: true },
          },
        ],
      },
    ],
    resultMapping: [
      {
        conditions: [
          {
            operator: { type: String, enum: ['<', '<=', '=', '>=', '>'], required: true },
            value: { type: Number, required: true },
          },
        ],
        resultText: { type: String, required: true },
        image: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const TestModel = model('Test', TestSchema);

module.exports = TestModel;