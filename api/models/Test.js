const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TestSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    cover:String,
    author:{type:Schema.Types.ObjectId, ref:'User'},
}, {
    timestamps: true,
});

const TestModel = model('Test', TestSchema);

module.exports = TestModel;