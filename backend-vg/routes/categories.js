const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../middleware/validate');
const { triggerRevalidation } = require('../utils/revalidate');

router.get('/', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const query = includeInactive ? {} : { active: true };
    const categories = await Category.find(query).sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('categories.list', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, active: true });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('categories.by-slug', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, requireRole(['admin', 'editor']), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive number'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  validate
], async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    await triggerRevalidation({ reason: 'categories.changed', paths: ['/portfolio'] });
    res.status(201).json(category);
  } catch (error) {
    console.error('categories.create', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Category slug already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, requireRole(['admin', 'editor']), [
  body('name').optional().trim().notEmpty().withMessage('Name must not be empty'),
  body('slug').optional().trim().notEmpty().withMessage('Slug must not be empty'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive number'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  validate
], async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await triggerRevalidation({ reason: 'categories.changed', paths: ['/portfolio'] });
    res.json(category);
  } catch (error) {
    console.error('categories.update', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    await triggerRevalidation({ reason: 'categories.changed', paths: ['/portfolio'] });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('categories.delete', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
