const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Check if Authorization header exists
        if (!req.header('Authorization')) {
            return res.status(401).json({ message: 'No authorization token provided' });
        }

        const token = req.header('Authorization').replace('Bearer ', '');
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        
        // Find the user
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // Add user and token to request
        req.user = user;
        req.token = token;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ message: 'Please authenticate' });
    }
};

module.exports = auth;