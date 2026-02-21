require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dbConnect = require('./config/db');

const adminRoutes = require('./routes/admin');
const contentRoutes = require('./routes/content');
const categoriesRoutes = require('./routes/categories');
const galleriesRoutes = require('./routes/galleries');
const contactRoutes = require('./routes/contact');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/galleries', galleriesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
