const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    let query = { active: true };
    
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }
    
    if (featured === 'true') query.featured = true;
    
    let galleriesQuery = Gallery.find(query)
      .populate('category', 'name slug')
      .sort({ order: 1, createdAt: -1 });
    
    if (limit) galleriesQuery = galleriesQuery.limit(parseInt(limit));
    
    const galleries = await galleriesQuery;
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const gallery = await Gallery.findOne({ slug: req.params.slug, active: true })
      .populate('category', 'name slug');
    
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    await gallery.save();
    await gallery.populate('category', 'name slug');
    res.status(201).json(gallery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');
    
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    res.json(gallery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    res.json({ message: 'Gallery deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/images', auth, async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    
    gallery.images.push(...req.body.images);
    await gallery.save();
    res.json(gallery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id/images/:imageId', auth, async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    
    gallery.images = gallery.images.filter(
      img => img._id.toString() !== req.params.imageId
    );
    await gallery.save();
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
