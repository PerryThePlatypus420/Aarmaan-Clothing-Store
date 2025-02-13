// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require("../models/Product");


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

// Get total number of orders
router.get('/total-orders', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments(); // Count total orders
    res.json({ totalOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch total orders' });
  }
});

// Get all orders with product details
router.get("/all-orders", async (req, res) => {
  try {
      const orders = await Order.find().sort({ createdAt: -1 }); // Sort newest first

      // Fetch product details for each order
      const populatedOrders = await Promise.all(
          orders.map(async (order) => {
              const populatedProducts = await Promise.all(
                  order.products.map(async (product) => {
                      const productDetails = await Product.findById(product.productId);
                      return {
                          productId: product.productId,
                          productName: productDetails ? productDetails.title : "Unknown Product",
                          imageURL: productDetails ? productDetails.img : "default.jpg",
                          quantity: product.quantity
                      };
                  })
              );
              return { ...order._doc, products: populatedProducts };
          })
      );

      res.json(populatedOrders);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch orders" });
  }
});


// Update order status
router.put("/update-status/:id", async (req, res) => {
  try {
      const { status } = req.body;
      const updatedOrder = await Order.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
      );
      res.json(updatedOrder);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;


