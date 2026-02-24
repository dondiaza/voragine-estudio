require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const dbConnect = require('./config/db');
const sanitizeInputs = require('./middleware/sanitize');
const uploadMiddleware = require('./middleware/upload');
const { fallbackHandler } = require('./fallback/api');

const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/categories');
const galleryRoutes = require('./routes/galleries');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const settingsRoutes = require('./routes/settings');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');
const bootstrapRoutes = require('./routes/bootstrap');
const serviceRoutes = require('./routes/services');
const pageRoutes = require('./routes/pages');
const postRoutes = require('./routes/posts');
const testimonialRoutes = require('./routes/testimonials');
const publicRoutes = require('./routes/public');
const exportRoutes = require('./routes/export');

const app = express();
app.set('trust proxy', 1);

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsConfig = {
  origin: (origin, callback) => {
    if (!origin || corsOrigins.length === 0 || corsOrigins.includes('*')) {
      return callback(null, true);
    }
    if (corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS blocked'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-revalidate-token']
};

const generalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_MAX || 500),
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 20),
  message: { error: 'Too many login attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

const contactLimiter = rateLimit({
  windowMs: Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000),
  max: Number(process.env.CONTACT_RATE_LIMIT_MAX || 15),
  message: { error: 'Too many contact form attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsConfig));
app.use(generalLimiter);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(sanitizeInputs);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/uploads', express.static(uploadMiddleware.uploadDir || path.join(__dirname, 'uploads'), {
  maxAge: '7d'
}));

app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.get('/api/health', async (_req, res) => {
  const connected = await dbConnect();
  res.json({
    status: 'ok',
    database: connected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', async (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }

  const connected = await dbConnect();
  if (connected) {
    return next();
  }

  if (req.path.startsWith('/upload')) {
    return next();
  }

  const handled = await fallbackHandler(req, res);
  if (handled) {
    return;
  }

  return res.status(503).json({
    error: 'Database unavailable. Configure MONGODB_URI to use the full persistent CMS.'
  });
});

app.use('/api/public', publicRoutes);
app.use('/api/admin', authLimiter, adminRoutes);
app.use('/api/bootstrap-admin', bootstrapRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/export', exportRoutes);

app.get('/', (_req, res) => {
  res.json({
    message: 'Voragine API is running',
    version: '2.0.0'
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error('server.error', error);
  res.status(500).json({ error: 'Unexpected server error' });
});

if (require.main === module) {
  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

module.exports = app;
