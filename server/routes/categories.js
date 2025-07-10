const express = require("express");
const router = express.Router();
const Category = require("../models/Category"); // Import Category model
const multer = require("multer");
const { authenticateAdmin } = require('./auth');

// Multer configuration for image upload
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (validTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only .jpg and .png are allowed!'), false); // Reject the file
    }
};
const upload = multer({ storage, fileFilter });

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        const categoriesWithBase64Images = categories.map(category => {
            let imgBase64 = null;
            if (category.img) {
                // Ensure proper buffer to base64 conversion
                const buffer = Buffer.from(category.img);
                imgBase64 = `data:image/png;base64,${buffer.toString('base64')}`;
            }
            
            return {
                _id: category._id,
                category: category.category,
                img: imgBase64
            };
        });
        res.json(categoriesWithBase64Images);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
});

// Update the add route to ensure proper buffer handling
router.post("/add", authenticateAdmin, upload.single("img"), async (req, res) => {
    try {
        const { category } = req.body;
        let img = null;
        
        if (req.file) {
            img = Buffer.from(req.file.buffer);
        }
        
        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }
        
        const newCategory = new Category({ 
            category, 
            img: img 
        });
        
        await newCategory.save();
        res.status(201).json({ 
            message: "Category added successfully", 
            category: {
                ...newCategory._doc,
                img: img ? `data:image/png;base64,${img.toString('base64')}` : null
            }
        });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Failed to add category" });
    }
});

// ✅ Edit an existing category
router.put("/edit/:id", authenticateAdmin, upload.single("img"), async (req, res) => {
    try {
        const { category } = req.body;
        const img = req.file ? req.file.buffer : null;
        const updateData = { category };
        if (img) {
            updateData.img = img;
        }
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
router.delete("/delete/:id", authenticateAdmin, async (req, res) => {
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