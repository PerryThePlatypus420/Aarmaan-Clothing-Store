const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    freeDeliveryThreshold: {
        type: Number,
        default: null, // null means no free delivery threshold set
        required: false
    },
    deliveryFee: {
        type: Number,
        default: 250, // Default delivery fee
        required: true,
        min: 0
    },
    // Can add more settings in the future
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
settingsSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Settings', settingsSchema);
