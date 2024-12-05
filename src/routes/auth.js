const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { authLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ email, password, name });
    await user.save();
    
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({ 
      user: userWithoutPassword,
      token,
      expiresIn: '24h'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ 
      user: userWithoutPassword,
      token,
      expiresIn: '24h'
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/refresh-token', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newToken = generateToken(user);
    res.json({ token: newToken, expiresIn: '24h' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;