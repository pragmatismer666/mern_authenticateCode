const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  product_name: String,
  credit_price: Number,
  meta_data: {},
  category_id: Schema.Types.ObjectId
}, { timestamps: true });


const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;