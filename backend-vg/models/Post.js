const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
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
  content: {
    type: String,
    trim: true,
    default: ''
  },
  coverImage: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: 'noticias'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  author: {
    type: String,
    trim: true,
    default: 'Equipo Vorágine'
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  published: {
    type: Boolean,
    default: true
  },
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

postSchema.index({ publishedAt: -1, active: 1 });

module.exports = mongoose.model('Post', postSchema);
