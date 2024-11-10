const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'randomdigits_1234567890', async (err, user) => {
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

module.exports = authenticateToken;
