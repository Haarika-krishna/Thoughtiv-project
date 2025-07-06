const express = require('express');
const router = express.Router();
const axios = require('axios');
const Users = require('../models/Users');
require('dotenv').config();

const SERP_API_KEY = process.env.API_KEY;

router.post('/', async (req, res) => {
  const { keyword, location, limit, device_id } = req.body;

  if (!keyword || !location || !limit || !device_id) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    let user = await Users.findOne({ device_id });

    // First-time visitor (no record)
    if (!user) {
      await Users.create({
        device_id,
        search_count: 1,
        last_search: new Date()
      });
    } else {
      const { search_count, user: userDetails } = user;
      const isRegistered = userDetails && userDetails.email;
      const isPremium = userDetails && userDetails.is_premium;

      if (isPremium) {
        user.search_count += 1;
        user.last_search = new Date();
        await user.save();
      } else if (isRegistered && search_count < 2) {
        user.search_count += 1;
        user.last_search = new Date();
        await user.save();
      } else if (isRegistered && search_count >= 2) {
        return res.status(403).json({
          success: false,
          message: 'You have reached your free search limit. Upgrade to premium.',
        });
      } else if (!isRegistered && search_count >= 1) {
        return res.status(403).json({
          success: false,
          message: 'Please register to continue searching.',
        });
      }
    }

    // If allowed to reach here, do actual SERP API fetch
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_maps',
        q: `${keyword} in ${location}`,
        api_key: SERP_API_KEY,
      },
    });

    const results = response.data.local_results || [];

    return res.status(200).json({
      success: true,
      data: results.slice(0, parseInt(limit)),
    });

  } catch (err) {
    console.error('Search route error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error during search' });
  }
});

module.exports = router;
