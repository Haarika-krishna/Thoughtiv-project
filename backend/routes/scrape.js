const express = require('express');
const router = express.Router();
const scrapeGoogleMaps = require('../scraper');

router.post('/scrape', async (req, res) => {
  const { keyword, location, limit } = req.body;

  if (!keyword || !location) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const data = await scrapeGoogleMaps(keyword, location, limit || 5);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Scraping failed' });
  }
});

module.exports = router;
