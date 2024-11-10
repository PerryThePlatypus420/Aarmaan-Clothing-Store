// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create an order
router.post('/create', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      city,
      address,
      phone,
      email,
      additionalInfo,
      products,
      totalAmount
    } = req.body;

    const order = new Order({
      firstName,
      lastName,
      city,
      address,
      phone,
      email,
      additionalInfo,
      products,
      totalAmount
    });

    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;
