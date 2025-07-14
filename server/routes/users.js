const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, authenticateAdmin } = require('./auth');

const router = express.Router();

// Use the JWT_SECRET from environment variables
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'randomdigits_1234567890';

// Register Route - Updated to require admin authentication and handle isAdmin flag
router.post('/register', authenticateAdmin, async (req, res) => {
    const { name, username, email, password, isAdmin } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Include isAdmin if provided, otherwise default to false
        const newUser = new User({ 
            name, 
            username, 
            email, 
            password: hashedPassword,
            isAdmin: isAdmin === true ? true : false // Explicitly set to boolean
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Route (include isAdmin in the response)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin, // Include admin status in the response
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Protected route for admins
router.get('/admin', authenticateAdmin, (req, res) => {
    res.json({ message: 'Welcome, Admin!' });
});

// User info route - return formatted user object
router.get('/me', authenticateToken, (req, res) => {
    res.json({ 
        user: {
            id: req.user._id,
            name: req.user.name,
            username: req.user.username,
            email: req.user.email,
            isAdmin: req.user.isAdmin
        }
    });
});

// Change password route - requires authentication
router.post('/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current password and new password are required' });
    }
    
    try {
        // Get the user from the database
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update the password
        user.password = hashedPassword;
        await user.save();
        
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
