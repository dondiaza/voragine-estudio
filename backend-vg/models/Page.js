const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  heading: { type: String, trim: true, default: '' },
  body: { type: String, trim: true, default: '' },
  image: { type: String, trim: true, default: '' },
  ctaLabel: { type: String, trim: true, default: '' },
  ctaUrl: { type: String, trim: true, default: '' },
  items: [{ type: mongoose.Schema.Types.Mixed }],
  order: { type: Number, default: 0 }
}, { _id: false });

const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  hero: {
    eyebrow: { type: String, trim: true, default: '' },
    title: { type: String, trim: true, default: '' },
    subtitle: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
    ctaLabel: { type: String, trim: true, default: '' },
    ctaUrl: { type: String, trim: true, default: '' }
  },
  modules: [moduleSchema],
  active: {
    type: Boolean,
    default: true
  },
  seo: {
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    canonical: { type: String, trim: true, default: '' },
    ogImage: { type: String, trim: true, default: '' },
    noIndex: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Page', pageSchema);
