const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Users = require('../models/Users');
require('dotenv').config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  const { name, email, password, device_id } = req.body;

  try {
    const existingByEmail = await Users.findOne({ 'user.email': email });
    if (existingByEmail) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create token with all required user details
    const token = jwt.sign(
      { name, email, password: hashedPassword, device_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const verificationLink = `http://localhost:5000/verify/${token}`; // 👈 your backend route

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Verify your Email',
      html: `<p>Hello ${name},</p>
             <p>Click the button below to verify your email and complete registration:</p>
             <a href="${verificationLink}" style="padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
             <p>This link will expire in 1 day.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Verification email sent. Please check your inbox.' });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
