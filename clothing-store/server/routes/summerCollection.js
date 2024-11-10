const express = require('express');
const router = express.Router();
const SummerCollection = require('../models/SummerCollection');

// Get all products in the summer collection
router.get('/', async (req, res) => {
  try {
    const summerCollection = await SummerCollection.find().populate('productID');
    res.send(summerCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
