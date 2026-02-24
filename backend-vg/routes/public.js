const express = require('express');
const Page = require('../models/Page');
const Service = require('../models/Service');
const Category = require('../models/Category');
const Gallery = require('../models/Gallery');
const Post = require('../models/Post');
const Testimonial = require('../models/Testimonial');
const Settings = require('../models/Settings');

const router = express.Router();

router.get('/bootstrap', async (_req, res) => {
  try {
    const [settings, pages, services, categories, projects, posts, testimonials] = await Promise.all([
      Settings.findOne(),
      Page.find({ active: true }).sort({ slug: 1 }),
      Service.find({ active: true }).sort({ order: 1, createdAt: -1 }),
      Category.find({ active: true }).sort({ order: 1, name: 1 }),
      Gallery.find({ active: true }).populate('category', 'name slug').sort({ order: 1, createdAt: -1 }),
      Post.find({ active: true, published: true }).sort({ publishedAt: -1 }),
      Testimonial.find({ active: true }).sort({ order: 1, createdAt: -1 })
    ]);

    res.json({
      settings,
      pages,
      services,
      categories,
      projects,
      posts,
      testimonials
    });
  } catch (error) {
    console.error('public.bootstrap', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
