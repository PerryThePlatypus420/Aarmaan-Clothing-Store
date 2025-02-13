const express = require("express");
const router = express.Router();
const Category = require("../models/Category"); // Import Category model

// ✅ Get all categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// ✅ Add a new category
router.post("/add", async (req, res) => {
    try {
        const { category, img } = req.body;

        if (!category || !img) {
            return res.status(400).json({ error: "Category and image URL are required" });
        }

        const newCategory = new Category({ category, img });
        await newCategory.save();
        res.status(201).json({ message: "Category added successfully", category: newCategory });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Failed to add category" });
    }
});

// ✅ Edit an existing category
router.put("/edit/:id", async (req, res) => {
    try {
        const { category, img } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { category, img },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Failed to update category" });
    }
});

// ✅ Delete a category
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Failed to delete category" });
    }
});

module.exports = router;
