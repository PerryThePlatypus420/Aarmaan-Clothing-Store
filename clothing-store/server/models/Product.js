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
    img: {
        type: String,
        required: true
    },
    description: {
        type: Object,
        required: true
    }
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
