const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);

        try {
            const userData = await User.findById(user.userId);
            if (!userData) return res.sendStatus(404); // User not found
            req.user = userData; // Attach user data to req
            next();
        } catch (error) {
            return res.sendStatus(500); // Internal server error
        }
    });
};

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });

        try {
            const userData = await User.findById(user.userId);
            if (!userData) return res.status(404).json({ error: 'User not found.' });
            
            if (!userData.isAdmin) {
                return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
            }
            
            req.user = userData; // Attach admin user data to req
            next();
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    });
};

module.exports = { authenticateToken, authenticateAdmin };
