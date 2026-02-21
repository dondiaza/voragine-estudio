const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const defaultContent = {
  hero: { title: 'Capturamos instantes que no vuelven', subtitle: 'Fotografía artística para momentos únicos', cta: 'Contáctanos' },
  services: { title: 'Qué hacemos', subtitle: 'Especialistas en capturar la esencia de cada momento', items: [
    { id: 'bodas', title: 'Bodas', description: 'Documentamos el día más importante.' },
    { id: 'eventos', title: 'Eventos', description: 'Fiestas y celebraciones.' },
    { id: 'personal', title: 'Personal', description: 'Retratos que revelan tu esencia.' },
    { id: 'creativos', title: 'Proyectos Creativos', description: 'Colaboraciones artísticas.' }
  ]},
  about: { title: 'Por qué Vorágine', subtitle: 'Más que fotografía, creamos experiencias visuales', items: [
    { title: 'Mirada artística', description: 'Cada imagen es una composición cuidada.' },
    { title: 'Edición cuidada', description: 'Posproducción profesional.' },
    { title: 'Experiencia', description: 'Años de trabajo nos permiten anticipar.' },
    { title: 'Entrega premium', description: 'Materiales de alta calidad.' },
    { title: 'Cercanía', description: 'Trato personalizado.' }
  ]},
  process: { title: 'Nuestro proceso', subtitle: 'Un viaje creativo juntos', steps: [
    { number: '01', title: 'Nos cuentas tu historia', description: 'Escuchamos tus ideas.' },
    { number: '02', title: 'Diseñamos la sesión', description: 'Planificamos cada detalle.' },
    { number: '03', title: 'Capturamos el momento', description: 'Trabajamos con sensibilidad.' },
    { number: '04', title: 'Entregamos recuerdos', description: 'Cuidamos cada imagen.' }
  ]},
  cta: { title: 'Cuéntanos qué quieres capturar', subtitle: 'Estamos aquí para escuchar tu historia', button: 'Escríbenos' }
};

const defaultCategories = [
  { _id: '1', name: 'Bodas', slug: 'bodas', description: 'Fotografía de bodas' },
  { _id: '2', name: 'Eventos', slug: 'eventos', description: 'Eventos y fiestas' },
  { _id: '3', name: 'Personal', slug: 'personal', description: 'Retratos personales' },
  { _id: '4', name: 'Proyectos Creativos', slug: 'proyectos-creativos', description: 'Proyectos artísticos' }
];

const defaultGalleries = [
  { _id: '1', title: 'Boda Elena & Javier', slug: 'elena-javier', category: defaultCategories[0], images: [], featured: true },
  { _id: '2', title: 'Sesión París', slug: 'session-paris', category: defaultCategories[2], images: [], featured: true }
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/content/:section?', (req, res) => {
  const { section } = req.params;
  if (section) {
    res.json({ section, data: defaultContent[section] || {} });
  } else {
    res.json(defaultContent);
  }
});

app.get('/api/categories', (req, res) => {
  res.json(defaultCategories);
});

app.get('/api/galleries', (req, res) => {
  res.json(defaultGalleries);
});

app.get('/api/galleries/:slug', (req, res) => {
  const gallery = defaultGalleries.find(g => g.slug === req.params.slug);
  if (gallery) {
    res.json(gallery);
  } else {
    res.status(404).json({ error: 'Gallery not found' });
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, projectType, message } = req.body;
  if (!name || !email || !projectType || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  res.json({ message: 'Message received (demo mode)', id: Date.now() });
});

app.get('/api/settings', (req, res) => {
  res.json({
    siteName: 'Vorágine Estudio',
    tagline: 'Capturamos instantes que no vuelven',
    email: 'info@voragineestudio.com'
  });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ token: 'demo-token-12345', admin: { id: '1', username: 'admin', email: 'admin@voragineestudio.com' } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/admin/me', (req, res) => {
  const auth = req.header('Authorization');
  if (auth && auth.startsWith('Bearer demo-token-12345')) {
    res.json({ id: '1', username: 'admin', email: 'admin@voragineestudio.com', name: 'Admin Vorágine' });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Voragine API is running', version: '1.0.0' });
});

module.exports = app;
