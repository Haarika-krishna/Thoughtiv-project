require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Express app - MUST be declared before using app
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

// Root test route (optional)
app.get('/', (req, res) => {
  res.send('🚀 API Scraper Backend is Running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});
