const express = require('express');
const router = express.Router();
const HomeProducts = require('../models/HomepageProducts');

// Get all products in the homepage products collection
router.get('/', async (req, res) => {
  try {
    const home_products = await HomeProducts.find().populate('productID');
    res.send(home_products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a product to the homepage collection
router.post('/add', async (req, res) => {
  try {
    const { productID } = req.body;
    const existingProduct = await HomeProducts.findOne({ productID });

    if (existingProduct) {
      return res.status(400).json({ message: 'Product already exists on homepage' });
    }

    const newHomeProduct = new HomeProducts({ productID });
    await newHomeProduct.save();
    res.status(201).json(newHomeProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product from the homepage collection
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await HomeProducts.findOneAndDelete({ productID: id });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found in homepage collection' });
    }

    res.json({ message: 'Product removed from homepage' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
