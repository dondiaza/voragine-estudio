const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
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
  excerpt: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    trim: true
  },
  gallery: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  ctaLabel: {
    type: String,
    trim: true,
    default: 'Solicitar presupuesto'
  },
  ctaUrl: {
    type: String,
    trim: true,
    default: '/contacto'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  seo: {
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    canonical: { type: String, trim: true, default: '' },
    ogImage: { type: String, trim: true, default: '' }
  }
}, {
  timestamps: true
});

serviceSchema.index({ order: 1, featured: -1 });

module.exports = mongoose.model('Service', serviceSchema);
