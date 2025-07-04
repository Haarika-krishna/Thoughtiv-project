const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Users = require('./models/Users');
const searchRoute = require('./routes/search');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json()); // for reading JSON body
app.use('/search', searchRoute); 

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => {
  console.log(' MongoDB connected');
})
.catch((err) => {
  console.error(' MongoDB connection error:', err);
});



