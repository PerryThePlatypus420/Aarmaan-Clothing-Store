const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: Buffer,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    design_details: {
        type: String,
        required: true
    },
    sizes: [{
        size: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true
        }
    }]
});

// Virtual field for id
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are included in JSON output
productSchema.set('toJSON', {
    virtuals: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
