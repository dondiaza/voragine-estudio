const express = require('express');
const { body } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../middleware/validate');
const { triggerRevalidation } = require('../utils/revalidate');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const includeDrafts = req.query.includeDrafts === 'true';
    const limit = Number(req.query.limit || 0);

    const query = {};
    if (!includeInactive) query.active = true;
    if (!includeDrafts) query.published = true;

    let queryBuilder = Post.find(query).sort({ publishedAt: -1, createdAt: -1 });
    if (limit > 0) queryBuilder = queryBuilder.limit(limit);

    const posts = await queryBuilder;
    res.json(posts);
  } catch (error) {
    console.error('posts.list', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const includeDraft = req.query.includeDraft === 'true';
    const query = { slug: req.params.slug, active: true };
    if (!includeDraft) query.published = true;

    const post = await Post.findOne(query);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('posts.by-slug', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, requireRole(['admin', 'editor']), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('excerpt').optional().trim().isLength({ max: 300 }).withMessage('Excerpt too long'),
  body('content').optional().trim(),
  body('published').optional().isBoolean().withMessage('Published must be boolean'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  validate
], async (req, res) => {
  try {
    const post = await Post.create(req.body);
    await triggerRevalidation({ reason: 'blog.changed', paths: ['/blog', `/blog/${post.slug}`] });
    res.status(201).json(post);
  } catch (error) {
    console.error('posts.create', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Post slug already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, requireRole(['admin', 'editor']), [
  body('title').optional().trim().notEmpty().withMessage('Title must not be empty'),
  body('slug').optional().trim().notEmpty().withMessage('Slug must not be empty'),
  body('published').optional().isBoolean().withMessage('Published must be boolean'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  validate
], async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await triggerRevalidation({ reason: 'blog.changed', paths: ['/blog', `/blog/${post.slug}`] });
    res.json(post);
  } catch (error) {
    console.error('posts.update', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await triggerRevalidation({ reason: 'blog.changed', paths: ['/blog'] });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('posts.delete', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
