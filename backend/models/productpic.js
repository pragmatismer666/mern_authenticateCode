const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductpicSchema = new Schema({
  meta_data: {},
}, { timestamps: true });


const Productpic = mongoose.model('Productpic', ProductpicSchema);

module.exports = Productpic;