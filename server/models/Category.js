const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    category: { type: String, required: true, unique: true },
    img: { type: Buffer, required: true } // URL of the category image
});

module.exports = mongoose.model("Category", CategorySchema);
