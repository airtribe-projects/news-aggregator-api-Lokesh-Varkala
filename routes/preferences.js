const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { users } = require('./data');

// Middleware to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

// GET preferences
router.get('/', verifyToken, (req, res) => {
    const user = users.find(u => u.email === req.user.email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ preferences: user.preferences });
});

// PUT preferences
router.put('/', verifyToken, (req, res) => {
    const user = users.find(u => u.email === req.user.email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { preferences } = req.body;
    if (!preferences || !Array.isArray(preferences)) return res.status(400).json({ message: 'Preferences must be an array' });

    user.preferences = preferences;
    res.json({ preferences: user.preferences });
});

module.exports = router;
