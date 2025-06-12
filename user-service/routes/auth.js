const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists with this email' });
        }
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists with this username' });
        }

        user = new User({ username, email, password });
        await user.save();

        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, userId: user.id, username: user.username });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during registration');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials (email)' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials (password)' });
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, userId: user.id, username: user.username });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during login');
    }
});

// Get User (Protected route example - more robust auth middleware would be better)
router.get('/user/:id', async (req, res) => {
    // Basic token check - in a real app, use middleware to verify token
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user || user.id !== req.params.id) {
            return res.status(404).json({ msg: 'User not found or mismatch' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
        res.status(500).send('Server error');
    }
});


module.exports = router;