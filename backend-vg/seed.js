require('dotenv').config();
const mongoose = require('mongoose');

const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Gallery = require('./models/Gallery');
const Service = require('./models/Service');
const Page = require('./models/Page');
const Post = require('./models/Post');
const Testimonial = require('./models/Testimonial');
const Settings = require('./models/Settings');
const Content = require('./models/Content');
const Message = require('./models/Message');

const categories = [
  { name: 'Bodas', slug: 'bodas', description: 'Fotografía de bodas artística y emotiva', order: 1 },
  { name: 'Eventos', slug: 'eventos', description: 'Cobertura fotográfica para eventos corporativos y sociales', order: 2 },
  { name: 'Retratos', slug: 'retratos', description: 'Sesiones personales, pareja y familiar', order: 3 },
  { name: 'Comercial', slug: 'comercial', description: 'Fotografía para marcas, productos y campañas', order: 4 }
];

const services = [
  {
    title: 'Fotografía de bodas',
    slug: 'fotografia-bodas',
    excerpt: 'Cobertura documental y editorial para bodas íntimas y celebraciones grandes.',
    description: 'Acompañamos todo el día con enfoque documental y dirección editorial cuando hace falta.',
    coverImage: '/images/services/bodas.jpg',
    tags: ['bodas', 'editorial'],
    featured: true,
    order: 1
  },
  {
    title: 'Eventos y corporativo',
    slug: 'eventos-corporativo',
    excerpt: 'Eventos sociales, lanzamientos, congresos y comunicación corporativa.',
    description: 'Entregas rápidas, material optimizado para prensa y redes, y cobertura en múltiples formatos.',
    coverImage: '/images/services/eventos.jpg',
    tags: ['eventos', 'corporativo'],
    featured: true,
    order: 2
  },
  {
    title: 'Retrato personal',
    slug: 'retrato-personal',
    excerpt: 'Retratos de autor para profesionales, artistas y familias.',
    description: 'Diseño de sesión y dirección de pose con enfoque natural y estético.',
    coverImage: '/images/services/retratos.jpg',
    tags: ['retratos'],
    order: 3
  },
  {
    title: 'Producción comercial',
    slug: 'produccion-comercial',
    excerpt: 'Fotografía de producto y campañas para marcas.',
    description: 'Producción en estudio o locación con dirección de arte y entrega multiplataforma.',
    coverImage: '/images/services/comercial.jpg',
    tags: ['comercial', 'producto'],
    order: 4
  }
];

const testimonials = [
  {
    name: 'Marta y Diego',
    role: 'Pareja',
    quote: 'Nos sentimos acompañados todo el tiempo y las fotos quedaron increíbles.',
    rating: 5,
    featured: true,
    order: 1
  },
  {
    name: 'Ana Torres',
    role: 'Marketing Manager',
    company: 'Lumen Studio',
    quote: 'Respuesta rápida, ejecución impecable y entregables listos para campaña.',
    rating: 5,
    featured: true,
    order: 2
  }
];

const posts = [
  {
    title: 'Cómo planificar una sesión de boda sin estrés',
    slug: 'planificar-sesion-boda-sin-estres',
    excerpt: 'Una guía práctica para coordinar fotografía, tiempos y expectativas.',
    content: 'Planificar una boda implica muchas decisiones. En este artículo compartimos el flujo recomendado para que la fotografía sea natural y sin prisas.',
    category: 'guias',
    tags: ['bodas', 'guia'],
    publishedAt: new Date('2026-01-15')
  },
  {
    title: 'Checklist de fotografía para eventos corporativos',
    slug: 'checklist-fotografia-eventos-corporativos',
    excerpt: 'Qué preparar antes de cubrir un evento de marca.',
    content: 'Antes de cualquier evento corporativo revisamos objetivos, momentos clave, voceros y formatos de entrega.',
    category: 'corporativo',
    tags: ['eventos', 'corporativo'],
    publishedAt: new Date('2026-01-22')
  }
];

const pages = [
  {
    name: 'Home',
    slug: 'home',
    hero: {
      eyebrow: 'Vorágine Estudio',
      title: 'Capturamos instantes que no vuelven',
      subtitle: 'Fotografía artística para bodas, eventos, retratos y proyectos comerciales.',
      ctaLabel: 'Agenda una reunión',
      ctaUrl: '/contacto'
    },
    modules: [
      {
        type: 'intro',
        heading: 'Fotografía corporativa y emocional',
        body: 'Combinamos narrativa documental y dirección editorial para crear imágenes con valor real de marca.',
        order: 1
      }
    ],
    seo: {
      title: 'Fotografía profesional en Madrid',
      description: 'Estudio de fotografía para bodas, eventos, retratos y marcas. Equipo creativo en Madrid.',
      canonical: '/'
    }
  },
  {
    name: 'Servicios',
    slug: 'servicios',
    hero: {
      eyebrow: 'Servicios',
      title: 'Soluciones fotográficas para cada necesidad',
      subtitle: 'Diseñamos cada sesión para objetivos concretos y resultados medibles.',
      ctaLabel: 'Solicitar propuesta',
      ctaUrl: '/contacto'
    },
    modules: [],
    seo: {
      title: 'Servicios de fotografía',
      description: 'Conoce servicios de fotografía para bodas, eventos, retratos y campañas.',
      canonical: '/servicios'
    }
  },
  {
    name: 'Portfolio',
    slug: 'portfolio',
    hero: {
      eyebrow: 'Portfolio',
      title: 'Casos y proyectos destacados',
      subtitle: 'Una selección de trabajos reales con enfoque artístico y comercial.',
      ctaLabel: 'Ver casos',
      ctaUrl: '#proyectos'
    },
    seo: {
      title: 'Portfolio de fotografía',
      description: 'Galerías y casos reales de fotografía profesional.',
      canonical: '/portfolio'
    }
  },
  {
    name: 'Sobre nosotros',
    slug: 'sobre-nosotros',
    hero: {
      eyebrow: 'Equipo',
      title: 'Somos un estudio creativo orientado a resultados',
      subtitle: 'Años de experiencia entre editorial, documental y comercial.',
      ctaLabel: 'Conversemos',
      ctaUrl: '/contacto'
    },
    modules: [
      {
        type: 'text',
        heading: 'Qué nos diferencia',
        body: 'Planificación, dirección visual y postproducción coherente con la identidad de cada cliente.',
        order: 1
      }
    ],
    seo: {
      title: 'Sobre Vorágine Estudio',
      description: 'Conoce al equipo y la metodología de trabajo de Vorágine Estudio.',
      canonical: '/sobre-nosotros'
    }
  },
  {
    name: 'Contacto',
    slug: 'contacto',
    hero: {
      eyebrow: 'Contacto',
      title: 'Cuéntanos tu proyecto',
      subtitle: 'Respondemos en 24-48h con propuesta y próximos pasos.',
      ctaLabel: 'Enviar mensaje',
      ctaUrl: '#formulario-contacto'
    },
    seo: {
      title: 'Contacto',
      description: 'Escríbenos para reservar sesión o pedir presupuesto de fotografía.',
      canonical: '/contacto'
    }
  },
  {
    name: 'Blog',
    slug: 'blog',
    hero: {
      eyebrow: 'Blog',
      title: 'Noticias y recursos',
      subtitle: 'Tendencias, guías y procesos detrás de cada proyecto.',
      ctaLabel: 'Últimos artículos',
      ctaUrl: '#articulos'
    },
    seo: {
      title: 'Blog de fotografía',
      description: 'Artículos de fotografía para bodas, eventos y marcas.',
      canonical: '/blog'
    }
  }
];

const settings = {
  siteName: 'Vorágine Estudio',
  tagline: 'Capturamos instantes que no vuelven',
  email: 'info@voragineestudio.com',
  phone: '+34 600 000 000',
  address: 'Madrid, España',
  social: {
    instagram: 'https://instagram.com/voragineestudio',
    facebook: 'https://facebook.com/voragineestudio',
    x: '',
    tiktok: '',
    pinterest: ''
  },
  ctas: {
    primaryLabel: 'Agenda una reunión',
    primaryUrl: '/contacto',
    secondaryLabel: 'Ver portfolio',
    secondaryUrl: '/portfolio'
  },
  seo: {
    defaultTitle: 'Vorágine Estudio | Fotografía profesional',
    titleSuffix: 'Vorágine Estudio',
    defaultDescription: 'Fotografía para bodas, eventos, retratos y proyectos comerciales.',
    defaultOgImage: '',
    twitterHandle: '',
    locale: 'es_ES',
    siteUrl: 'http://localhost:3000'
  },
  business: {
    legalName: 'Vorágine Estudio',
    city: 'Madrid',
    country: 'España',
    openingHours: ['Mon-Fri 10:00-19:00']
  }
};

const projects = [
  {
    title: 'Boda Elena y Javier',
    slug: 'boda-elena-javier',
    description: 'Cobertura documental de boda en finca urbana.',
    category: 'bodas',
    tags: ['bodas', 'documental'],
    featured: true,
    order: 1,
    images: [
      { url: '/images/portfolio/boda-1.jpg', alt: 'Novios durante la ceremonia', order: 1, width: 1600, height: 1066 },
      { url: '/images/portfolio/boda-2.jpg', alt: 'Celebración con invitados', order: 2, width: 1600, height: 1066 }
    ],
    coverImage: '/images/portfolio/boda-cover.jpg'
  },
  {
    title: 'Lanzamiento de producto Lumen',
    slug: 'lanzamiento-lumen',
    description: 'Evento de marca con cobertura para prensa y social media.',
    category: 'eventos',
    tags: ['eventos', 'corporativo'],
    featured: true,
    order: 2,
    images: [
      { url: '/images/portfolio/evento-1.jpg', alt: 'Presentación de producto', order: 1, width: 1600, height: 1066 },
      { url: '/images/portfolio/evento-2.jpg', alt: 'Networking y asistentes', order: 2, width: 1600, height: 1066 }
    ],
    coverImage: '/images/portfolio/evento-cover.jpg'
  }
];

const legacyContent = {
  hero: {
    title: 'Capturamos instantes que no vuelven',
    subtitle: 'Fotografía artística para momentos únicos',
    cta: 'Contáctanos'
  },
  services: {
    title: 'Qué hacemos',
    subtitle: 'Especialistas en capturar la esencia de cada momento',
    items: services.map((service) => ({
      id: service.slug,
      title: service.title,
      description: service.excerpt
    }))
  }
};

const resetCollections = async () => {
  await Promise.all([
    Admin.deleteMany({}),
    Category.deleteMany({}),
    Gallery.deleteMany({}),
    Service.deleteMany({}),
    Page.deleteMany({}),
    Post.deleteMany({}),
    Testimonial.deleteMany({}),
    Settings.deleteMany({}),
    Content.deleteMany({}),
    Message.deleteMany({})
  ]);
};

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is required to seed the database');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await resetCollections();
    console.log('Collections cleaned');

    const admin = await Admin.create({
      username: 'admin',
      password: 'admin12345',
      email: 'admin@voragineestudio.com',
      name: 'Administrador',
      role: 'admin',
      active: true
    });

    await Admin.create({
      username: 'editor',
      password: 'editor12345',
      email: 'editor@voragineestudio.com',
      name: 'Editor',
      role: 'editor',
      active: true
    });
    console.log('Users created');

    const createdCategories = await Category.insertMany(categories);
    const categoryMap = createdCategories.reduce((acc, item) => {
      acc[item.slug] = item._id;
      return acc;
    }, {});
    console.log('Categories created');

    await Service.insertMany(services);
    console.log('Services created');

    await Testimonial.insertMany(testimonials);
    console.log('Testimonials created');

    await Post.insertMany(posts);
    console.log('Posts created');

    await Page.insertMany(pages);
    console.log('Pages created');

    await Settings.create(settings);
    console.log('Settings created');

    await Content.insertMany(
      Object.entries(legacyContent).map(([section, data]) => ({ section, data }))
    );
    console.log('Legacy content created');

    const normalizedProjects = projects.map((project) => ({
      ...project,
      category: categoryMap[project.category]
    }));
    await Gallery.insertMany(normalizedProjects);
    console.log('Portfolio projects created');

    console.log('\n✅ Database seeded successfully');
    console.log('\n📝 Credentials:');
    console.log('   admin / admin12345');
    console.log('   editor / editor12345');
    console.log('\n🚀 Start API with: npm run dev');
    console.log(`\nSeed finished for user: ${admin.username}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
