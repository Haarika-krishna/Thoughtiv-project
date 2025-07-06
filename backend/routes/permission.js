const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

// Search permission handler with enhanced logic
router.post('/', async (req, res) => {
  const { device_id } = req.body;

  if (!device_id) {
    return res.status(400).json({
      success: false,
      allow: false,
      message: 'Device ID is required'
    });
  }

  try {
    const user = await Users.findOne({ device_id });

    // CASE 1: First-time visitor (no record exists)
    if (!user) {
      const newUser = await Users.create({
        device_id,
        search_count: 1,
        last_search: new Date(),
        created_at: new Date()
      });
      
      return res.json({
        success: true,
        allow: true,
        message: 'First search allowed',
        search_count: 1
      });
    }

    // CASE 2: Premium user (unlimited searches)
    if (user.user?.is_premium) {
      return res.json({
        success: true,
        allow: true,
        message: 'Premium access granted',
        search_count: user.search_count
      });
    }

    // CASE 3: Unregistered user after first search
    if (!user.user?.email && user.search_count >= 1) {
      return res.json({
        success: false,
        allow: false,
        message: 'Please register to continue searching',
        search_count: user.search_count
      });
    }

    // CASE 4: Registered non-premium user after limit
    if (user.user?.email && user.search_count >= 2) {
      return res.json({
        success: false,
        allow: false,
        message: 'Upgrade to premium for unlimited searches',
        search_count: user.search_count
      });
    }

    // CASE 5: Allowed search (increment count)
    user.search_count += 1;
    user.last_search = new Date();
    await user.save();

    return res.json({
      success: true,
      allow: true,
      message: user.user?.email 
        ? `Search allowed (${user.search_count}/2 for free users)` 
        : 'Search allowed',
      search_count: user.search_count
    });

  } catch (err) {
    console.error('Permission error:', err);
    return res.status(500).json({
      success: false,
      allow: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;