const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Admin = require('../models/Admin');
const validate = require('../middleware/validate');

// Bootstrap a first admin if none exists, protected by a token
router.post('/', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('name').optional().trim(),
  validate
], async (req, res) => {
  try {
    const token = req.header('X-Bootstrap-Token');
    if (!token || token !== process.env.BOOTSTRAP_ADMIN_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized bootstrap token' });
    }

    const existing = await Admin.findOne();
    if (existing) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const { username, password, email, name } = req.body;
    const admin = new Admin({ username, password, email, name, role: 'admin', active: true });
    await admin.save();
    res.json({ message: 'Admin bootstraped', admin: { id: admin._id, username: admin.username, email: admin.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
