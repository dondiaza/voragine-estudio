const express = require('express');
const { body } = require('express-validator');
const Page = require('../models/Page');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../middleware/validate');
const { triggerRevalidation } = require('../utils/revalidate');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const query = includeInactive ? {} : { active: true };
    const pages = await Page.find(query).sort({ slug: 1 });
    res.json(pages);
  } catch (error) {
    console.error('pages.list', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const query = { slug: req.params.slug };
    if (!includeInactive) query.active = true;

    const page = await Page.findOne(query);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    console.error('pages.by-slug', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, requireRole(['admin', 'editor']), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('modules').optional().isArray().withMessage('Modules must be an array'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  validate
], async (req, res) => {
  try {
    const page = await Page.create(req.body);
    await triggerRevalidation({ reason: 'pages.changed', paths: [pathFromSlug(page.slug)] });
    res.status(201).json(page);
  } catch (error) {
    console.error('pages.create', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Page slug already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, requireRole(['admin', 'editor']), [
  body('name').optional().trim().notEmpty().withMessage('Name must not be empty'),
  body('slug').optional().trim().notEmpty().withMessage('Slug must not be empty'),
  body('modules').optional().isArray().withMessage('Modules must be an array'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  validate
], async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    await triggerRevalidation({ reason: 'pages.changed', paths: [pathFromSlug(page.slug)] });
    res.json(page);
  } catch (error) {
    console.error('pages.update', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    await triggerRevalidation({ reason: 'pages.changed', paths: [pathFromSlug(page.slug)] });
    res.json({ message: 'Page deleted' });
  } catch (error) {
    console.error('pages.delete', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const pathFromSlug = (slug) => {
  const map = {
    home: '/',
    servicios: '/servicios',
    portfolio: '/portfolio',
    'sobre-nosotros': '/sobre-nosotros',
    contacto: '/contacto',
    blog: '/blog'
  };
  return map[slug] || `/${slug}`;
};

module.exports = router;
