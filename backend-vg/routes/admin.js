const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Admin = require('../models/Admin');
const { generateToken } = require('../config/jwt');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const validate = require('../middleware/validate');

router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username, active: true });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(admin._id);
    
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('admin.login', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    res.json(admin);
  } catch (error) {
    console.error('admin.me', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  validate
], async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.adminId);
    
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    admin.password = newPassword;
    await admin.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('admin.change-password', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users', auth, requireRole('admin'), async (_req, res) => {
  try {
    const users = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('admin.users', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/users', auth, requireRole('admin'), [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').optional().trim(),
  body('role').optional().isIn(['admin', 'editor']).withMessage('Role must be admin or editor'),
  validate
], async (req, res) => {
  try {
    const user = await Admin.create(req.body);
    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('admin.create-user', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id', auth, requireRole('admin'), [
  body('name').optional().trim(),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['admin', 'editor']).withMessage('Role must be admin or editor'),
  body('active').optional().isBoolean().withMessage('Active must be boolean'),
  validate
], async (req, res) => {
  try {
    const { name, email, role, active } = req.body;
    const updated = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, email, role, active },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('admin.update-user', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
