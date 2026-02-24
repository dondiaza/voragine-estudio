const multer = require('multer');
const path = require('path');
const fs = require('fs');

const blobToken = (process.env.BLOB_READ_WRITE_TOKEN || '').trim();
const hasBlobStorage = Boolean(blobToken);

const uploadDir = process.env.UPLOAD_DIR || (
  process.env.VERCEL
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, '../uploads')
);

if (!hasBlobStorage && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const subDir = req.params.type || 'general';
    const dir = path.join(uploadDir, subDir);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(new Error('Only image files are allowed'));
};

const upload = multer({
  storage: hasBlobStorage ? multer.memoryStorage() : diskStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

upload.uploadDir = uploadDir;
upload.hasBlobStorage = hasBlobStorage;
upload.blobToken = blobToken;

module.exports = upload;
