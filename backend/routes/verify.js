const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
require('dotenv').config();

router.get('/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, password, device_id } = decoded;

    // Check if user already registered
    const existingUser = await Users.findOne({ 'user.email': email });

    if (existingUser) {
      if (existingUser.user.verified) {
        return res.send('<h3>✅ Email is already verified. You can log in now.</h3>');
      } else {
        existingUser.user.verified = true;
        await existingUser.save();
        return res.send('<h3>🎉 Email verified! You can now <a href="http://localhost:3000/login">log in</a>.</h3>');
      }
    }

    // If not already registered, create new user
    await Users.create({
      device_id,
      search_count: 1,
      last_search: new Date(),
      user: {
        name,
        email,
        password,
        is_premium: false,
        verified: true
      }
    });

    res.send('<h3>✅ Email verified and registration complete! You can now <a href="http://localhost:3000/login">log in</a>.</h3>');

  } catch (err) {
    console.error('Verification Error:', err);
    res.status(400).send('<h3>⛔ Invalid or expired verification link.</h3>');
  }
});

module.exports = router;
