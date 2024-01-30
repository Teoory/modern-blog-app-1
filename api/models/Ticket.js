const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TicketSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Closed'],
        default: 'Open',
    },
}, {
    timestamps: true,
});

const TicketModel = model('Ticket', TicketSchema);

module.exports = TicketModel;
