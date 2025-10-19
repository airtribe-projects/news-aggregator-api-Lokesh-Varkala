const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { users } = require('./data');

// REGISTER
router.post('/users/signup', async (req, res) => {
    try {
        const { name, email, password, preferences } = req.body;

        if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
        if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ name, email, password: hashedPassword, preferences: preferences || ['general'] });

        res.status(200).json({ message: 'User registered' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// LOGIN
router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, preferences: user.preferences });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = { router, users };
