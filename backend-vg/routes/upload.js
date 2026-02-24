const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const uploadBaseDir = upload.uploadDir || path.join(__dirname, '../uploads');

const sanitizeFolder = (type) => (type || 'general').replace(/[^a-zA-Z0-9-_]/g, '');

router.post('/:type?', auth, requireRole(['admin', 'editor']), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const type = sanitizeFolder(req.params.type);
    const imageUrl = `/uploads/${type}/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/multiple/:type?', auth, requireRole(['admin', 'editor']), upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const type = sanitizeFolder(req.params.type);
    const urls = req.files.map(file => ({
      url: `/uploads/${type}/${file.filename}`,
      filename: file.filename
    }));
    
    res.json({
      message: 'Files uploaded successfully',
      files: urls
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:type/:filename', auth, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const type = sanitizeFolder(req.params.type);
    const filename = path.basename(req.params.filename);
    const filePath = path.join(uploadBaseDir, type, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
