const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.send(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.send(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get products by multiple IDs
router.post('/ids', async (req, res) => {
    try {
        const ids = req.body.ids;
        console.log(ids);
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty IDs array' });
        }

        const products = await Product.find({ '_id': { $in: ids } });
        res.send(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
