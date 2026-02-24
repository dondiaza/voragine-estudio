const express = require('express');
const path = require('path');
const fs = require('fs');
const { put, del, BlobNotFoundError } = require('@vercel/blob');

const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();
const uploadBaseDir = upload.uploadDir || path.join(__dirname, '../uploads');
const hasBlobStorage = Boolean(upload.hasBlobStorage && upload.blobToken);
const blobToken = upload.blobToken;

const sanitizeFolder = (type) => (type || 'general').replace(/[^a-zA-Z0-9-_]/g, '');
const sanitizeFilename = (filename) => filename.replace(/[^a-zA-Z0-9._-]/g, '');

const buildBlobPath = (type, filename) => `uploads/${sanitizeFolder(type)}/${sanitizeFilename(filename)}`;

const uploadFileToBlob = async (file, type) => {
  const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const pathname = buildBlobPath(type, uniqueName);

  const uploaded = await put(pathname, file.buffer, {
    access: 'public',
    token: blobToken,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: file.mimetype || 'application/octet-stream'
  });

  return {
    url: uploaded.url,
    filename: uniqueName
  };
};

router.post('/:type?', auth, requireRole(['admin', 'editor']), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const type = sanitizeFolder(req.params.type);
    if (hasBlobStorage) {
      const uploaded = await uploadFileToBlob(req.file, type);
      return res.json({
        message: 'File uploaded successfully',
        url: uploaded.url,
        filename: uploaded.filename
      });
    }

    const imageUrl = `/uploads/${type}/${req.file.filename}`;
    return res.json({
      message: 'File uploaded successfully',
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('upload.single', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/multiple/:type?', auth, requireRole(['admin', 'editor']), upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const type = sanitizeFolder(req.params.type);
    if (hasBlobStorage) {
      const files = await Promise.all(req.files.map((file) => uploadFileToBlob(file, type)));
      return res.json({
        message: 'Files uploaded successfully',
        files
      });
    }

    const urls = req.files.map((file) => ({
      url: `/uploads/${type}/${file.filename}`,
      filename: file.filename
    }));

    return res.json({
      message: 'Files uploaded successfully',
      files: urls
    });
  } catch (error) {
    console.error('upload.multiple', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:type/:filename', auth, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const type = sanitizeFolder(req.params.type);
    const rawFilename = decodeURIComponent(req.params.filename || '');

    if (hasBlobStorage) {
      const target = /^https?:\/\//i.test(rawFilename)
        ? rawFilename
        : buildBlobPath(type, path.basename(rawFilename));

      await del(target, { token: blobToken });
      return res.json({ message: 'File deleted successfully' });
    }

    const filename = path.basename(rawFilename);
    const filePath = path.join(uploadBaseDir, type, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ message: 'File deleted successfully' });
    }

    return res.status(404).json({ error: 'File not found' });
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return res.status(404).json({ error: 'File not found' });
    }
    console.error('upload.delete', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
