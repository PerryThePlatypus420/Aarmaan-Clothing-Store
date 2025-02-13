const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HomePageProductsSchema = new Schema({
  productID: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, { collection: 'homepageProducts' });

module.exports = mongoose.model('HomePageProducts', HomePageProductsSchema);
