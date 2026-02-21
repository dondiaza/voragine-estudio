const express = require('express');
const router = express.Router();

const defaultContent = {
  hero: {
    title: 'Capturamos instantes que no vuelven',
    subtitle: 'Fotografía artística para momentos únicos',
    cta: 'Contáctanos'
  },
  services: {
    title: 'Qué hacemos',
    subtitle: 'Especialistas en capturar la esencia de cada momento',
    items: [
      { id: 'bodas', title: 'Bodas', description: 'Documentamos el día más importante de vuestra vida con sensibilidad y arte.', image: '/images/wedding.jpg' },
      { id: 'eventos', title: 'Eventos', description: 'Fiestas, celebraciones y encuentros que merecen ser recordados.', image: '/images/event.jpg' },
      { id: 'personal', title: 'Personal', description: 'Retratos que revelan tu esencia y personalidad única.', image: '/images/portrait.jpg' },
      { id: 'creativos', title: 'Proyectos Creativos', description: 'Colaboraciones artísticas y proyectos visuales especiales.', image: '/images/creative.jpg' }
    ]
  },
  about: {
    title: 'Por qué Vorágine',
    subtitle: 'Más que fotografía, creamos experiencias visuales',
    items: [
      { title: 'Mirada artística', description: 'Cada imagen es una composición cuidada con sentido estético.' },
      { title: 'Edición cuidada', description: 'Posproducción profesional que realza sin alterar la esencia.' },
      { title: 'Experiencia', description: 'Años de trabajo nos permiten anticipar y capturar cada momento.' },
      { title: 'Entrega premium', description: 'Materiales de alta calidad y presentación impecable.' },
      { title: 'Cercanía', description: 'Trato personalizado porque cada proyecto es único.' }
    ]
  },
  process: {
    title: 'Nuestro proceso',
    subtitle: 'Un viaje creativo juntos',
    steps: [
      { number: '01', title: 'Nos cuentas tu historia', description: 'Escuchamos tus ideas, inquietudes y lo que quieres transmitir.' },
      { number: '02', title: 'Diseñamos la sesión', description: 'Planificamos cada detalle para que todo fluya naturalmente.' },
      { number: '03', title: 'Capturamos el momento', description: 'Trabajamos con sensibilidad, buscando la autenticidad.' },
      { number: '04', title: 'Entregamos recuerdos', description: 'Cuidamos cada imagen y te entregamos obras de arte.' }
    ]
  },
  cta: {
    title: 'Cuéntanos qué quieres capturar',
    subtitle: 'Estamos aquí para escuchar tu historia',
    button: 'Escríbenos'
  }
};

router.get('/:section?', async (req, res) => {
  try {
    const Content = require('../models/Content');
    const { section } = req.params;
    
    if (section) {
      const content = await Content.findOne({ section });
      if (!content) {
        return res.json({ section, data: defaultContent[section] || {} });
      }
      res.json(content);
    } else {
      const contents = await Content.find();
      const result = { ...defaultContent };
      contents.forEach(c => {
        result[c.section] = c.data;
      });
      res.json(result);
    }
  } catch (error) {
    console.log('Using default content (no DB)');
    const { section } = req.params;
    if (section) {
      res.json({ section, data: defaultContent[section] || {} });
    } else {
      res.json(defaultContent);
    }
  }
});

const auth = require('../middleware/auth');

router.put('/:section', auth, async (req, res) => {
  try {
    const Content = require('../models/Content');
    const { section } = req.params;
    const { data } = req.body;
    
    const content = await Content.findOneAndUpdate(
      { section },
      { section, data, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

module.exports = router;
