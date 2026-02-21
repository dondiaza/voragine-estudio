require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Gallery = require('./models/Gallery');
const Content = require('./models/Content');
const Settings = require('./models/Settings');

const categories = [
  { name: 'Bodas', slug: 'bodas', description: 'Fotografía de bodas artística y emotiva', order: 1 },
  { name: 'Eventos', slug: 'eventos', description: 'Celebraciones y eventos especiales', order: 2 },
  { name: 'Personal', slug: 'personal', description: 'Retratos y sesiones personales', order: 3 },
  { name: 'Proyectos Creativos', slug: 'proyectos-creativos', description: 'Proyectos artísticos y colaboraciones', order: 4 }
];

const sampleGalleries = [
  {
    title: 'Elena & Javier',
    slug: 'elena-javier',
    description: 'Una boda íntima en un castillo medieval',
    category: 'bodas',
    featured: true,
    images: [
      { url: '/images/gallery/wedding-1.jpg', alt: 'Novia caminando', order: 1 },
      { url: '/images/gallery/wedding-2.jpg', alt: 'Ceremonia', order: 2 },
      { url: '/images/gallery/wedding-3.jpg', alt: 'Anillos', order: 3 }
    ]
  },
  {
    title: 'Sesión en París',
    slug: 'session-paris',
    description: 'Retratos urbanos en la ciudad luz',
    category: 'personal',
    featured: true,
    images: [
      { url: '/images/gallery/portrait-1.jpg', alt: 'Retrato París', order: 1 }
    ]
  }
];

const content = {
  hero: {
    title: 'Capturamos instantes que no vuelven',
    subtitle: 'Fotografía artística para momentos únicos',
    cta: 'Contáctanos'
  },
  services: {
    title: 'Qué hacemos',
    subtitle: 'Especialistas en capturar la esencia de cada momento',
    items: [
      { id: 'bodas', title: 'Bodas', description: 'Documentamos el día más importante de vuestra vida con sensibilidad y arte.' },
      { id: 'eventos', title: 'Eventos', description: 'Fiestas, celebraciones y encuentros que merecen ser recordados.' },
      { id: 'personal', title: 'Personal', description: 'Retratos que revelan tu esencia y personalidad única.' },
      { id: 'creativos', title: 'Proyectos Creativos', description: 'Colaboraciones artísticas y proyectos visuales especiales.' }
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

const settings = {
  siteName: 'Vorágine Estudio',
  tagline: 'Capturamos instantes que no vuelven',
  email: 'info@voragineestudio.com',
  phone: '+34 600 000 000',
  address: 'Madrid, España',
  social: {
    instagram: 'https://instagram.com/voragineestudio',
    facebook: '',
    pinterest: ''
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Admin.deleteMany({});
    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      email: 'admin@voragineestudio.com',
      name: 'Administrador'
    });
    await admin.save();
    console.log('Admin user created');
    
    await Category.deleteMany({});
    const categoryDocs = await Category.insertMany(categories);
    console.log('Categories created');
    
    const categoryMap = {};
    categoryDocs.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });
    
    await Gallery.deleteMany({});
    for (const gallery of sampleGalleries) {
      const newGallery = new Gallery({
        ...gallery,
        category: categoryMap[gallery.category]
      });
      await newGallery.save();
    }
    console.log('Galleries created');
    
    await Content.deleteMany({});
    for (const [section, data] of Object.entries(content)) {
      await Content.create({ section, data });
    }
    console.log('Content created');
    
    await Settings.deleteMany({});
    await Settings.create(settings);
    console.log('Settings created');
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🚀 You can now start the server with: npm start');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
