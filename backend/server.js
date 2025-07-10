require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const scrapeGoogleMaps = require('./scraper'); // ✅ Import scraper logic

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🛣️ Routes
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const searchRoute = require('./routes/search');
const verifyRoute = require('./routes/verify');
const scrapeRoute = require('./routes/scrape'); // ✅ Only import ONCE

// 📌 Route Bindings
app.use('/api', scrapeRoute);        // Custom scraper route: POST /api/scrape
app.use('/login', loginRoute);       // POST /login
app.use('/register', registerRoute); // POST /register
app.use('/search', searchRoute);     // POST /search
app.use('/verify', verifyRoute);     // POST /verify

// 🔗 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// 🔍 Optional: direct SERP scraping route
app.post('/fetch', async (req, res) => {
  const { keyword, location, limit } = req.body;

  if (!keyword || !location || !limit) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const data = await scrapeGoogleMaps(keyword, location, parseInt(limit));
    res.json({ success: true, data });
  } catch (error) {
    console.error('🔴 Scraping Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
});

// 🏠 Root route
app.get('/', (req, res) => {
  res.send('🚀 API Scraper Backend is Running!');
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
