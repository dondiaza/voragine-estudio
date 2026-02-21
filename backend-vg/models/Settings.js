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
    pinterest: { type: String, default: '' }
  },
  heroImage: {
    type: String,
    default: ''
  },
  heroVideo: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
