const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PrevievPostSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    cover:String,
    author:{type:Schema.Types.ObjectId, ref:'User'},
}, {
    timestamps: true,
});

const PrevievPostModel = model('PrevievPost', PrevievPostSchema);

module.exports = PrevievPostModel;