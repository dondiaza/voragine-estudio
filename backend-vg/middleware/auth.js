const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { DEMO_TOKEN } = require('../fallback/api');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if (token === DEMO_TOKEN) {
      req.adminId = '1';
      req.adminRole = 'admin';
      req.isDemoAuth = true;
      return next();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('_id role active');

    if (!admin || !admin.active) {
      return res.status(401).json({ error: 'Account not active' });
    }

    req.adminId = admin._id.toString();
    req.adminRole = admin.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
