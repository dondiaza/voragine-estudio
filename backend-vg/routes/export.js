const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const Category = require('../models/Category');
const Gallery = require('../models/Gallery');
const Service = require('../models/Service');
const Page = require('../models/Page');
const Post = require('../models/Post');
const Testimonial = require('../models/Testimonial');
const Settings = require('../models/Settings');

const router = express.Router();

router.get('/', auth, requireRole('admin'), async (_req, res) => {
  try {
    const [categories, galleries, services, pages, posts, testimonials, settings] = await Promise.all([
      Category.find().lean(),
      Gallery.find().lean(),
      Service.find().lean(),
      Page.find().lean(),
      Post.find().lean(),
      Testimonial.find().lean(),
      Settings.findOne().lean()
    ]);

    res.json({
      exportedAt: new Date().toISOString(),
      categories,
      galleries,
      services,
      pages,
      posts,
      testimonials,
      settings
    });
  } catch (error) {
    console.error('export.cms', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
