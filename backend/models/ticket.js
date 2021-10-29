const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    opener_id: Schema.Types.ObjectId,
    receiver_id: Schema.Types.ObjectId,
    is_opener_read: Boolean,
    is_receiver_read: Boolean,
    title: String,
  }, {timestamps: true});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;