const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

router.post('/:type?', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const type = req.params.type || 'general';
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

router.post('/multiple/:type?', auth, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const type = req.params.type || 'general';
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

router.delete('/:type/:filename', auth, async (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', type, filename);
    
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
