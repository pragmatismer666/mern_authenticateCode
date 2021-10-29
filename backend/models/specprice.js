const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpecpriceSchema = new Schema({
  product_id: Schema.Types.ObjectId,
  user_id: Schema.Types.ObjectId,
  mainreseller_id: Schema.Types.ObjectId,
  price: Number
}, { timestamps: true });


const Specprice = mongoose.model('Specprice', SpecpriceSchema);

module.exports = Specprice;