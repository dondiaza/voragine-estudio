const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

const defaultSettings = {
  siteName: 'Vorágine Estudio',
  tagline: 'Capturamos instantes que no vuelven',
  email: 'info@voragineestudio.com',
  phone: '+34 600 000 000',
  address: 'Madrid, España',
  social: {
    instagram: 'https://instagram.com/voragineestudio',
    facebook: '',
    pinterest: ''
  },
  heroImage: '',
  heroVideo: ''
};

router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(defaultSettings);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
