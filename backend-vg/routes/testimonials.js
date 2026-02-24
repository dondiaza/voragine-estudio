const express = require('express');
const { body } = require('express-validator');
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../middleware/validate');
const { triggerRevalidation } = require('../utils/revalidate');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const featured = req.query.featured === 'true';
    const query = includeInactive ? {} : { active: true };
    if (featured) query.featured = true;

    const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('testimonials.list', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, requireRole(['admin', 'editor']), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('quote').trim().notEmpty().withMessage('Quote is required'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive number'),
  validate
], async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    await triggerRevalidation({ reason: 'testimonials.changed', paths: ['/', '/sobre-nosotros'] });
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('testimonials.create', error);
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, requireRole(['admin', 'editor']), [
  body('name').optional().trim().notEmpty().withMessage('Name must not be empty'),
  body('quote').optional().trim().notEmpty().withMessage('Quote must not be empty'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive number'),
  validate
], async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    await triggerRevalidation({ reason: 'testimonials.changed', paths: ['/', '/sobre-nosotros'] });
    res.json(testimonial);
  } catch (error) {
    console.error('testimonials.update', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    await triggerRevalidation({ reason: 'testimonials.changed', paths: ['/', '/sobre-nosotros'] });
    res.json({ message: 'Testimonial deleted' });
  } catch (error) {
    console.error('testimonials.delete', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
