const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('../models/Users');

router.post('/', async (req, res) => {
  const { name, email, password, device_id } = req.body;

  try {
    const existingByEmail = await Users.findOne({ 'user.email': email });

    if (existingByEmail) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userDoc = await Users.findOne({ device_id });

    if (userDoc) {
      userDoc.user = { name, email, password: hashedPassword, is_premium: false };
      await userDoc.save();
    } else {
      await Users.create({
        device_id,
        search_count: 1,
        last_search: new Date(),
        user: { name, email, password: hashedPassword, is_premium: false }
      });
    }

    res.json({ success: true, message: 'Registered successfully' });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
