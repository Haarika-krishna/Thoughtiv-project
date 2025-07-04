const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Users = require('../models/Users');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await Users.findOne({ "user.email": email });

    if (!users) {
      return res.json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, users.user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    // Remove password before sending user data
    const userCopy = { ...users._doc };
    delete userCopy.user.password;

    res.json({ success: true, message: 'Login successful', user: userCopy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
