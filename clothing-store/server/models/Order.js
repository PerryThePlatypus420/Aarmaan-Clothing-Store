const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  city: String,
  address: String,
  phone: String,
  email: String,
  additionalInfo: String,
  products: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number
  }],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
