const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('../models/Users');

router.post('/', async (req, res) => {
  const { name, email, password, device_id } = req.body;

  if (!device_id || !email || !password || !name) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if user already registered by email
    const existingByEmail = await Users.findOne({ "user.email": email });

    if (existingByEmail) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Find by device_id (already searched before registering)
    const userDoc = await Users.findOne({ device_id });

    if (userDoc) {
      // Update user details under existing device
      userDoc.user = {
        name,
        email,
        password: hashedPassword,
        is_premium: false
      };
      await userDoc.save();
    } else {
      // New device - create full user record
      await Users.create({
        device_id,
        search_count: 1,
        last_search: new Date(),
        user: {
          name,
          email,
          password: hashedPassword,
          is_premium: false
        }
      });
    }

    return res.json({ success: true, message: 'Registered successfully' });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
