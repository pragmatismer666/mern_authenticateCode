const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  password: String,
  role: String,
  main_reseller_product_gain: Number,
  credit: Number,
  note: String,
  avatar: {},
  main_reseller_id: Schema.Types.ObjectId
}, { timestamps: true });


const User = mongoose.model('User', UserSchema);

module.exports = User;