const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  projectType: {
    type: String,
    required: true,
    enum: ['bodas', 'eventos', 'personal', 'proyectos-creativos', 'otro']
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
