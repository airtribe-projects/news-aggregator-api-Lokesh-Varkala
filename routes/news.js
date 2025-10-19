const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { users, newsCache } = require('./data');

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

// GET /news
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = users.find(u => u.email === req.user.email);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Use cache if valid
        const now = Date.now();
        if (newsCache.data && newsCache.timestamp && now - newsCache.timestamp < 5 * 60 * 1000) {
            return res.json({ news: newsCache.data, source: 'cache' });
        }

        // Fetch news from API
        const country = user.preferences[0] || 'us';
        const category = user.preferences[1] || 'general';
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${process.env.NEWS_API_KEY}`);

        newsCache.data = response.data.articles;
        newsCache.timestamp = now;

        res.json({ news: response.data.articles, source: 'api' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error fetching news' });
    }
});

module.exports = router;
