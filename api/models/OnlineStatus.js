const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const totalVisitor = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const OnlineStatus = model('Visitor', totalVisitor);

module.exports = OnlineStatus;