const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

router.post('/', async (req, res) => {
  const { device_id } = req.body;

  if (!device_id) {
    return res.status(400).json({ success: false, message: 'Device ID is required' });
  }

  try {
    let userDoc = await Users.findOne({ device_id });

    if (!userDoc) {
      userDoc = new Users({ device_id, search_count: 1, last_search: new Date() });
      await userDoc.save();
      return res.json({ success: true, message: 'Search allowed (first time)' });
    }

    if (userDoc.user?.is_premium) {
      return res.json({ success: true, message: 'Search allowed (premium)' });
    }

    if (userDoc.search_count === 1 && !userDoc.user?.email) {
      return res.json({ success: false, message: 'Please register to continue' });
    }

    if (userDoc.search_count === 1 && userDoc.user?.email) {
      userDoc.search_count += 1;
      userDoc.last_search = new Date();
      await userDoc.save();
      return res.json({ success: true, message: 'Search allowed (registered user)' });
    }

    return res.json({ success: false, message: 'Upgrade to premium to continue' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
