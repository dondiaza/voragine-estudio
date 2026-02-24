const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const { sendMail, parseBoolean } = require('../utils/email');

router.post('/', [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('projectType').isIn(['bodas', 'eventos', 'personal', 'proyectos-creativos', 'otro']),
  body('message').trim().isLength({ min: 10, max: 4000 }).withMessage('Message is required'),
  body('website').optional().isString(),
  body('consent').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.body.website) {
      return res.status(202).json({ message: 'Submission accepted' });
    }
    
    const message = new Message({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      projectType: req.body.projectType,
      message: req.body.message
    });
    await message.save();

    const settings = await Settings.findOne();
    const receiver = process.env.CONTACT_RECEIVER || settings?.email;
    const projectLabelMap = {
      bodas: 'Bodas',
      eventos: 'Eventos',
      personal: 'Personal',
      'proyectos-creativos': 'Proyectos creativos',
      otro: 'Otro'
    };
    const projectTypeLabel = projectLabelMap[message.projectType] || message.projectType;

    if (receiver) {
      await sendMail({
        to: receiver,
        replyTo: message.email,
        subject: `[Web] Nuevo contacto: ${message.name}`,
        text: `${message.name} (${message.email})\nTipo: ${projectTypeLabel}\nTel: ${message.phone || '-'}\n\n${message.message}`,
        html: `<p><strong>Nombre:</strong> ${message.name}</p>
<p><strong>Email:</strong> ${message.email}</p>
<p><strong>Teléfono:</strong> ${message.phone || '-'}</p>
<p><strong>Tipo:</strong> ${projectTypeLabel}</p>
<p><strong>Mensaje:</strong></p>
<p>${message.message}</p>`
      });
    }

    if (parseBoolean(process.env.CONTACT_CONFIRMATION_ENABLED)) {
      await sendMail({
        to: message.email,
        subject: 'Hemos recibido tu mensaje',
        text: 'Gracias por contactar con Vorágine Estudio. Te responderemos pronto.',
        html: '<p>Gracias por contactar con Vorágine Estudio. Te responderemos pronto.</p>'
      });
    }
    
    res.status(201).json({ 
      message: 'Message sent successfully',
      id: message._id 
    });
  } catch (error) {
    console.error('contact.create', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { unread, archived } = req.query;
    let query = {};
    
    if (unread === 'true') query.read = false;
    if (archived !== 'true') query.archived = false;
    
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json(messages);
  } catch (error) {
    console.error('contact.list', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    if (!message.read) {
      message.read = true;
      await message.save();
    }
    
    res.json(message);
  } catch (error) {
    console.error('contact.by-id', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/archive', auth, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('contact.archive', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('contact.delete', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
