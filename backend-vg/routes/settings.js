const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../middleware/validate');
const { triggerRevalidation } = require('../utils/revalidate');

const defaultSettings = {
  siteName: 'Vorágine Estudio',
  tagline: 'Capturamos instantes que no vuelven',
  email: 'info@voragineestudio.com',
  phone: '+34 600 000 000',
  address: 'Madrid, España',
  social: {
    instagram: 'https://instagram.com/voragineestudio',
    facebook: '',
    x: '',
    tiktok: '',
    pinterest: ''
  },
  branding: {
    logo: '',
    favicon: ''
  },
  ctas: {
    primaryLabel: 'Reservar sesión',
    primaryUrl: '/contacto',
    secondaryLabel: 'Ver portfolio',
    secondaryUrl: '/portfolio'
  },
  seo: {
    defaultTitle: 'Vorágine Estudio | Fotografía profesional',
    titleSuffix: 'Vorágine Estudio',
    defaultDescription: 'Estudio de fotografía especializado en bodas, eventos, retratos y fotografía comercial.',
    defaultOgImage: '',
    twitterHandle: '',
    locale: 'es_ES',
    siteUrl: 'http://localhost:3000'
  },
  business: {
    legalName: 'Vorágine Estudio',
    city: 'Madrid',
    country: 'España',
    openingHours: ['Mon-Fri 10:00-19:00']
  }
};

router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(defaultSettings);
    }
    res.json(settings);
  } catch (error) {
    console.error('settings.get', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/', auth, requireRole(['admin', 'editor']), [
  body('siteName').optional().trim(),
  body('email').optional().isEmail().withMessage('A valid email is required'),
  body('seo.siteUrl').optional().isURL({ require_protocol: true }).withMessage('Site URL must be valid'),
  validate
], async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    await triggerRevalidation({ reason: 'settings.changed', paths: ['/', '/servicios', '/portfolio', '/sobre-nosotros', '/contacto', '/blog'] });
    res.json(settings);
  } catch (error) {
    console.error('settings.update', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
