const express = require('express');
const { body } = require('express-validator');
const Service = require('../models/Service');
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

    const services = await Service.find(query).sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('services.list', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const query = { slug: req.params.slug };
    if (!includeInactive) query.active = true;

    const service = await Service.findOne(query);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('services.by-slug', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, requireRole(['admin', 'editor']), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive number'),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  validate
], async (req, res) => {
  try {
    const service = await Service.create(req.body);
    await triggerRevalidation({ reason: 'services.changed', paths: ['/servicios', '/'] });
    res.status(201).json(service);
  } catch (error) {
    console.error('services.create', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Service slug already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, requireRole(['admin', 'editor']), [
  body('title').optional().trim().notEmpty().withMessage('Title must not be empty'),
  body('slug').optional().trim().notEmpty().withMessage('Slug must not be empty'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive number'),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  validate
], async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await triggerRevalidation({ reason: 'services.changed', paths: ['/servicios', '/', `/servicios/${service.slug}`] });
    res.json(service);
  } catch (error) {
    console.error('services.update', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await triggerRevalidation({ reason: 'services.changed', paths: ['/servicios', '/'] });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('services.delete', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
