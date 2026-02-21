const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { generateToken } = require('../config/jwt');
const auth = require('../middleware/auth');

router.post('/login', [
  body('username').trim().notEmpty(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(admin._id);
    
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/change-password', auth, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.adminId);
    
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    admin.password = newPassword;
    await admin.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
