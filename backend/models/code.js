const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CodeSchema = new Schema({
    code: String,    
    product_id: Schema.Types.ObjectId,
    is_active: Boolean
  }, {timestamps: true});
  

const Code = mongoose.model('Code', CodeSchema);

module.exports = Code;