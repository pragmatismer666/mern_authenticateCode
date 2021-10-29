const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    ticket_id: Schema.Types.ObjectId,
    message: String,
    user_id: Schema.Types.ObjectId
  }, {timestamps: true});
  

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;