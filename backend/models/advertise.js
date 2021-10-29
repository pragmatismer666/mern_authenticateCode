const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvertiseSchema = new Schema({
    content: String,    
  }, {timestamps: true});
  

const Advertise = mongoose.model('Advertise', AdvertiseSchema);

module.exports = Advertise;