const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const WarningSchema = new mongoose.Schema({
    title: String,
    message: String,
});

const WarningModel = model('Warning', WarningSchema);

module.exports = WarningModel;