const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Gallery = require('../models/Gallery');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../middleware/validate');
const { triggerRevalidation } = require('../utils/revalidate');

router.get('/', async (req, res) => {
  try {
    const { category, featured, limit, includeInactive, tag, sort = 'order' } = req.query;
    let query = { active: true };

    if (includeInactive === 'true') {
      query = {};
    }
    
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }
    
    if (featured === 'true') query.featured = true;
    if (tag) query.tags = tag.toString().toLowerCase();
    
    const sortMap = {
      order: { order: 1, createdAt: -1 },
      latest: { createdAt: -1 },
      title: { title: 1 }
    };
    const selectedSort = sortMap[sort] || sortMap.order;

    let galleriesQuery = Gallery.find(query)
      .populate('category', 'name slug')
      .sort(selectedSort);
    
    if (limit) galleriesQuery = galleriesQuery.limit(parseInt(limit));
    
    const galleries = await galleriesQuery;
    res.json(galleries);
  } catch (error) {
    console.error('galleries.list', error);
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
    console.error('galleries.by-slug', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, requireRole(['admin', 'editor']), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive number'),
  validate
], async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    await gallery.save();
    await gallery.populate('category', 'name slug');
    await triggerRevalidation({ reason: 'portfolio.changed', paths: ['/portfolio', '/'] });
    res.status(201).json(gallery);
  } catch (error) {
    console.error('galleries.create', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Gallery slug already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, requireRole(['admin', 'editor']), [
  body('title').optional().trim().notEmpty().withMessage('Title must not be empty'),
  body('slug').optional().trim().notEmpty().withMessage('Slug must not be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category must not be empty'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive number'),
  validate
], async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');
    
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    await triggerRevalidation({ reason: 'portfolio.changed', paths: ['/portfolio', '/', `/portfolio/${gallery.slug}`] });
    res.json(gallery);
  } catch (error) {
    console.error('galleries.update', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    await triggerRevalidation({ reason: 'portfolio.changed', paths: ['/portfolio', '/'] });
    res.json({ message: 'Gallery deleted' });
  } catch (error) {
    console.error('galleries.delete', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/images', auth, requireRole(['admin', 'editor']), [
  body('images').isArray({ min: 1 }).withMessage('Images array is required'),
  validate
], async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    
    gallery.images.push(...req.body.images);
    await gallery.save();
    await triggerRevalidation({ reason: 'portfolio.changed', paths: ['/portfolio', `/portfolio/${gallery.slug}`] });
    res.json(gallery);
  } catch (error) {
    console.error('galleries.add-images', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id/images/:imageId', auth, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }
    
    gallery.images = gallery.images.filter(
      img => img._id.toString() !== req.params.imageId
    );
    await gallery.save();
    await triggerRevalidation({ reason: 'portfolio.changed', paths: ['/portfolio', `/portfolio/${gallery.slug}`] });
    res.json(gallery);
  } catch (error) {
    console.error('galleries.delete-image', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
