const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SummerCollectionSchema = new Schema({
  productID: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, { collection: 'summerCollection' });

module.exports = mongoose.model('SummerCollection', SummerCollectionSchema);
