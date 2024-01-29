const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PrevievPostSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    cover:String,
    author:{
        type:Schema.Types.ObjectId,
         ref:'User'
    },
    PostTags: [{
        type: Schema.Types.String,
        ref: 'Post',
        required: true,
        default: 'Gündem'
    }],
}, {
    timestamps: true,
});

const PrevievPostModel = model('PrevievPost', PrevievPostSchema);

module.exports = PrevievPostModel;