const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Bootstrap a first admin if none exists, protected by a token
router.post('/', async (req, res) => {
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
    const admin = new Admin({ username, password, email, name });
    await admin.save();
    res.json({ message: 'Admin bootstraped', admin: { id: admin._id, username: admin.username, email: admin.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
