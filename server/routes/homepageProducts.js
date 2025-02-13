const express = require('express');
const router = express.Router();
const HomeProducts = require('../models/HomepageProducts');

// Get all products in the summer collection
router.get('/', async (req, res) => {
  try {
    const home_products = await HomeProducts.find().populate('productID');
    res.send(home_products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
