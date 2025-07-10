const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const HomeProducts = require('../models/HomepageProducts');
const multer = require('multer');
const { authenticateAdmin } = require('./auth');

// Multer configuration for multiple image uploads
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (validTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only .jpg, .jpeg, .png, and .gif are allowed!'), false);
    }
};
const upload = multer({ storage, fileFilter });

// ✅ Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        const productsWithImages = products.map(product => ({
            ...product._doc,
            images: product.images.map(img =>
                `data:image/png;base64,${Buffer.from(img).toString('base64')}`
            )
        }));
        res.json(productsWithImages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        const productsWithImages = products.map(product => ({
            ...product._doc,
            images: product.images.map(img =>
                `data:image/png;base64,${Buffer.from(img).toString('base64')}`
            )
        }));
        res.json(productsWithImages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productWithImages = {
            ...product._doc,
            images: product.images.map(img =>
                `data:image/png;base64,${Buffer.from(img).toString('base64')}`
            )
        };
        res.json(productWithImages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// In products.js - Update the add route (admin only)
router.post('/add', authenticateAdmin, upload.array('images', 10), async (req, res) => {
    try {
        const { title, price, category, description, design_details, sizes, homepage, stock } = req.body;
        const images = req.files ? req.files.map(file => Buffer.from(file.buffer)) : [];

        // Validate sizes
        let parsedSizes = [];
        try {
            parsedSizes = sizes ? JSON.parse(sizes) : [];
        } catch {
            return res.status(400).json({ message: 'Invalid sizes format' });
        }

        const newProduct = new Product({
            title,
            price,
            category,
            description,
            design_details,
            sizes: parsedSizes,
            images,
            stock: parsedSizes.length === 0 ? (stock || 0) : 0, // Only use stock if no sizes
        });

        const savedProduct = await newProduct.save();

        // Handle homepage addition if requested
        if (homepage === 'true') {
            const homepageExists = await HomeProducts.findOne({ productID: savedProduct._id });
            if (!homepageExists) {
                await new HomeProducts({ productID: savedProduct._id }).save();
            }
        }

        // Convert the saved product's images to base64 for immediate display
        const productWithImages = {
            ...savedProduct._doc,
            images: savedProduct.images.map(img => 
                `data:image/png;base64,${Buffer.from(img).toString('base64')}`
            )
        };

        res.status(201).json({
            message: "Product added successfully",
            product: productWithImages
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: error.message });
    }
});

// In products.js - Update the edit route (admin only)
router.put('/edit/:id', authenticateAdmin, upload.array('images', 10), async (req, res) => {
    try {
        const { title, price, category, description, design_details, sizes, homepage, keptImageIndexes, stock } = req.body;
        const newImages = req.files ? req.files.map(file => Buffer.from(file.buffer)) : [];

        // Validate sizes
        let parsedSizes = [];
        try {
            parsedSizes = sizes ? JSON.parse(sizes) : [];
        } catch {
            return res.status(400).json({ message: 'Invalid sizes format' });
        }

        // Parse kept image indexes
        let keptIndexes = [];
        try {
            keptIndexes = keptImageIndexes ? JSON.parse(keptImageIndexes) : [];
        } catch {
            return res.status(400).json({ message: 'Invalid kept image indexes format' });
        }

        // First get the existing product to access current images
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Keep only the images at the specified indexes
        const keptImages = keptIndexes.map(index => existingProduct.images[index]).filter(Boolean);

        const updateData = {
            title,
            price,
            category,
            description,
            design_details,
            sizes: parsedSizes,
            // Combine kept existing images with new images
            images: [...keptImages, ...newImages],
            // Only update stock if no sizes are present
            ...(parsedSizes.length === 0 ? { stock: stock || 0 } : {})
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        // Sync with homepage collection
        const homepageExists = await HomeProducts.findOne({ productID: req.params.id });
        if (homepage === 'true' && !homepageExists) {
            await new HomeProducts({ productID: req.params.id }).save();
        } else if (homepage !== 'true' && homepageExists) {
            await HomeProducts.findOneAndDelete({ productID: req.params.id });
        }

        // Convert images to base64 for immediate display
        const productWithImages = {
            ...updatedProduct._doc,
            images: updatedProduct.images.map(img => 
                `data:image/png;base64,${Buffer.from(img).toString('base64')}`
            )
        };

        res.json({
            message: "Product updated successfully",
            product: productWithImages
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: error.message });
    }
});

// ✅ Delete a product (removes from homepage too) (admin only)
router.delete('/delete/:id', authenticateAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // ✅ Remove from homepage if it exists
        await HomeProducts.findOneAndDelete({ productID: req.params.id });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get products by multiple IDs
router.post('/ids', async (req, res) => {
    try {
        const ids = req.body.ids;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ message: 'Invalid IDs array' });
        }

        // Return empty array if no IDs provided
        if (ids.length === 0) {
            return res.json([]);
        }

        const products = await Product.find({ '_id': { $in: ids } });
        const productsWithImages = products.map(product => ({
            ...product._doc,
            images: product.images.map(img =>
                `data:image/png;base64,${Buffer.from(img).toString('base64')}`
            )
        }));

        res.json(productsWithImages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Check stock availability for products
router.post('/check-stock', async (req, res) => {
    try {
        const { products } = req.body;
        if (!Array.isArray(products)) {
            return res.status(400).json({ message: 'Invalid products array' });
        }

        const stockCheck = [];
        
        for (const orderProduct of products) {
            const product = await Product.findById(orderProduct.productId);
            if (!product) {
                stockCheck.push({
                    productId: orderProduct.productId,
                    available: false,
                    reason: 'Product not found'
                });
                continue;
            }

            // Check size-specific stock if size is specified
            if (orderProduct.size && product.sizes && product.sizes.length > 0) {
                const sizeInfo = product.sizes.find(s => s.size === orderProduct.size);
                if (!sizeInfo) {
                    stockCheck.push({
                        productId: orderProduct.productId,
                        size: orderProduct.size,
                        available: false,
                        reason: 'Size not available'
                    });
                } else {
                    stockCheck.push({
                        productId: orderProduct.productId,
                        size: orderProduct.size,
                        available: sizeInfo.stock >= orderProduct.quantity,
                        availableStock: sizeInfo.stock,
                        requestedQuantity: orderProduct.quantity,
                        reason: sizeInfo.stock >= orderProduct.quantity ? 'Available' : 'Insufficient stock'
                    });
                }
            } else {
                // Check general stock
                stockCheck.push({
                    productId: orderProduct.productId,
                    available: product.stock >= orderProduct.quantity,
                    availableStock: product.stock,
                    requestedQuantity: orderProduct.quantity,
                    reason: product.stock >= orderProduct.quantity ? 'Available' : 'Insufficient stock'
                });
            }
        }

        res.json({ stockCheck });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
