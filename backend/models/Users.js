const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  device_id: { type: String, required: true, unique: true },
  search_count: { type: Number, default: 0 },
  last_search: { type: Date, default: Date.now },
  
  user: {
    name: String,
    password: String,
    email: String,
    is_premium: { type: Boolean, default: false },
    verified: { type: Boolean, default: false } 
  }
});

module.exports = mongoose.model('Users', userSchema);
