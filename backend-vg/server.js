require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/admin', require('./routes/admin'));
app.use('/api/content', require('./routes/content'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/galleries', require('./routes/galleries'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/bootstrap', require('./routes/bootstrap'));
app.use('/api/upload', require('./routes/upload'));

module.exports = app;
