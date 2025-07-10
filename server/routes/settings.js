const express = require('express');
const Settings = require('../models/Settings');
const { authenticateAdmin } = require('./auth');

const router = express.Router();

// Get current settings
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        // If no settings exist, create default settings
        if (!settings) {
            settings = new Settings({});
            await settings.save();
        }
        
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

// Update settings (admin only)
router.put('/', authenticateAdmin, async (req, res) => {
    try {
        const { freeDeliveryThreshold, deliveryFee } = req.body;
        
        // Validate the threshold
        if (freeDeliveryThreshold !== null && (freeDeliveryThreshold < 0 || isNaN(freeDeliveryThreshold))) {
            return res.status(400).json({ message: 'Free delivery threshold must be a positive number or null' });
        }
        
        // Validate the delivery fee
        if (deliveryFee !== undefined && (deliveryFee < 0 || isNaN(deliveryFee))) {
            return res.status(400).json({ message: 'Delivery fee must be a positive number' });
        }
        
        // Find existing settings or create new one
        const updateData = {};
        if (freeDeliveryThreshold !== undefined) {
            updateData.freeDeliveryThreshold = freeDeliveryThreshold;
        }
        if (deliveryFee !== undefined) {
            updateData.deliveryFee = deliveryFee;
        }
        
        const options = { 
            new: true, // Return the updated document
            upsert: true, // Create if doesn't exist
            setDefaultsOnInsert: true // Set default values when creating
        };
        
        const settings = await Settings.findOneAndUpdate({}, updateData, options);
        
        res.json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Error updating settings' });
    }
});

module.exports = router;
