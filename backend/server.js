require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const searchRoute = require('./routes/search');

app.use('/login', loginRoute);       // POST /login
app.use('/register', registerRoute); // POST /register
app.use('/search', searchRoute);     // POST /search

// 🔍 New: SERP API Route
app.post('/fetch', async (req, res) => {
  const { keyword, location, limit } = req.body;

  if (!keyword || !location || !limit) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_maps',
        q: `${keyword} in ${location}`,
        api_key: process.env.API_KEY,
      }
    });

    const results = response.data.local_results || [];
    res.json({ success: true, data: results.slice(0, parseInt(limit)) });

  } catch (error) {
    console.error('🔴 SERP API Error:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
});

// Root route (optional)
app.get('/', (req, res) => {
  res.send('🚀 API Scraper Backend is Running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
