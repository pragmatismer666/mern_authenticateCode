const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category_name: String,    
  }, {timestamps: true});
  

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;