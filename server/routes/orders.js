// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require("../models/Product");
const { authenticateAdmin } = require('./auth');


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

    // First, validate stock availability for all products
    for (const orderProduct of products) {
      const product = await Product.findById(orderProduct.productId);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${orderProduct.productId} not found` });
      }

      // Check if product has sizes and if a specific size was ordered
      if (orderProduct.size && product.sizes && product.sizes.length > 0) {
        const sizeInfo = product.sizes.find(s => s.size === orderProduct.size);
        if (!sizeInfo) {
          return res.status(400).json({ error: `Size ${orderProduct.size} not available for product ${product.title}` });
        }
        if (sizeInfo.stock < orderProduct.quantity) {
          return res.status(400).json({ error: `Insufficient stock for product ${product.title} in size ${orderProduct.size}. Available: ${sizeInfo.stock}, Requested: ${orderProduct.quantity}` });
        }
      } else {
        // Check general stock
        if (product.stock < orderProduct.quantity) {
          return res.status(400).json({ error: `Insufficient stock for product ${product.title}. Available: ${product.stock}, Requested: ${orderProduct.quantity}` });
        }
      }
    }

    // Create the order
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

    // Update stock for all products after successful order creation
    for (const orderProduct of products) {
      const product = await Product.findById(orderProduct.productId);
      
      if (orderProduct.size && product.sizes && product.sizes.length > 0) {
        // Update size-specific stock
        const sizeIndex = product.sizes.findIndex(s => s.size === orderProduct.size);
        if (sizeIndex !== -1) {
          product.sizes[sizeIndex].stock -= orderProduct.quantity;
        }
      } else {
        // Update general stock
        product.stock -= orderProduct.quantity;
      }

      await product.save();
    }

    res.status(201).json({ message: 'Order created successfully and stock updated', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get total number of orders
router.get('/total-orders', authenticateAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments(); // Count total orders
    res.json({ totalOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch total orders' });
  }
});

// Get a single order by ID (for completed page)
router.get('/order/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get all orders with product details
router.get("/all-orders", authenticateAdmin, async (req, res) => {
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
router.put("/update-status/:id", authenticateAdmin, async (req, res) => {
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


