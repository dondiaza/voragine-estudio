const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Vorágine Estudio'
  },
  tagline: {
    type: String,
    default: 'Capturamos instantes que no vuelven'
  },
  email: {
    type: String,
    default: 'info@voragineestudio.com'
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  social: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    x: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    pinterest: { type: String, default: '' }
  },
  branding: {
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' }
  },
  ctas: {
    primaryLabel: { type: String, default: 'Reservar sesión' },
    primaryUrl: { type: String, default: '/contacto' },
    secondaryLabel: { type: String, default: 'Ver portfolio' },
    secondaryUrl: { type: String, default: '/portfolio' }
  },
  seo: {
    defaultTitle: { type: String, default: 'Vorágine Estudio | Fotografía profesional' },
    titleSuffix: { type: String, default: 'Vorágine Estudio' },
    defaultDescription: { type: String, default: 'Estudio de fotografía especializado en bodas, eventos, retratos y fotografía comercial.' },
    defaultOgImage: { type: String, default: '' },
    twitterHandle: { type: String, default: '' },
    locale: { type: String, default: 'es_ES' },
    siteUrl: { type: String, default: 'http://localhost:3000' }
  },
  business: {
    legalName: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    openingHours: [{ type: String }],
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
