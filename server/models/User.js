const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart : { type: Array, default: [] },
    wishlist: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false }
    
}, { timestamps: true});

module.exports = mongoose.model('User', userSchema);
