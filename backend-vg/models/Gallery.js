const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [{
    url: String,
    alt: String,
    order: Number,
    width: Number,
    height: Number
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  coverImage: {
    type: String
  },
  clientName: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  eventDate: {
    type: Date
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
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

gallerySchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);
