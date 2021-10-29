const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
    user_id: Schema.Types.ObjectId,
    code_ids: [Schema.Types.ObjectId],
    product_id: Schema.Types.ObjectId,
    amount: Number
  }, {timestamps: true});
  

const Purchase = mongoose.model('Purchase', PurchaseSchema);

module.exports = Purchase;