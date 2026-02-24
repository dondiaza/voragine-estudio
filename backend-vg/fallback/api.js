const DEMO_TOKEN = 'demo-token-12345';

let idSeq = 1000;
const nextId = () => String(++idSeq);

const nowIso = () => new Date().toISOString();

const state = {
  admins: [
    {
      _id: '1',
      username: 'admin',
      password: 'admin12345',
      email: 'admin@voragineestudio.com',
      name: 'Administrador',
      role: 'admin',
      active: true,
      createdAt: nowIso()
    },
    {
      _id: '2',
      username: 'editor',
      password: 'editor12345',
      email: 'editor@voragineestudio.com',
      name: 'Editor',
      role: 'editor',
      active: true,
      createdAt: nowIso()
    }
  ],
  categories: [
    { _id: '10', name: 'Bodas', slug: 'bodas', description: 'Fotografía de bodas', order: 1, active: true },
    { _id: '11', name: 'Eventos', slug: 'eventos', description: 'Eventos sociales y corporativos', order: 2, active: true },
    { _id: '12', name: 'Retratos', slug: 'retratos', description: 'Retratos personales', order: 3, active: true },
    { _id: '13', name: 'Comercial', slug: 'comercial', description: 'Campañas de marca', order: 4, active: true }
  ],
  services: [
    {
      _id: '20',
      title: 'Fotografía de bodas',
      slug: 'fotografia-bodas',
      excerpt: 'Cobertura documental y editorial.',
      description: 'Acompañamos todo el día con enfoque documental y dirección editorial.',
      coverImage: '',
      tags: ['bodas'],
      ctaLabel: 'Solicitar presupuesto',
      ctaUrl: '/contacto',
      featured: true,
      active: true,
      order: 1
    },
    {
      _id: '21',
      title: 'Eventos corporativos',
      slug: 'eventos-corporativos',
      excerpt: 'Cobertura para eventos de marca.',
      description: 'Cobertura profesional para prensa y social media.',
      coverImage: '',
      tags: ['eventos', 'corporativo'],
      ctaLabel: 'Solicitar presupuesto',
      ctaUrl: '/contacto',
      featured: true,
      active: true,
      order: 2
    }
  ],
  projects: [
    {
      _id: '30',
      title: 'Boda Elena y Javier',
      slug: 'boda-elena-javier',
      description: 'Cobertura documental en finca.',
      category: '10',
      tags: ['bodas', 'documental'],
      images: [],
      coverImage: '',
      featured: true,
      active: true,
      order: 1,
      createdAt: nowIso()
    }
  ],
  pages: [
    {
      _id: '40',
      name: 'Home',
      slug: 'home',
      hero: {
        eyebrow: 'Vorágine Estudio',
        title: 'Capturamos instantes que no vuelven',
        subtitle: 'Fotografía artística para momentos únicos',
        ctaLabel: 'Contáctanos',
        ctaUrl: '/contacto'
      },
      modules: [],
      seo: {
        title: 'Inicio',
        description: 'Fotografía profesional',
        canonical: '/'
      },
      active: true
    }
  ],
  posts: [],
  testimonials: [],
  messages: [],
  content: {
    hero: {
      title: 'Capturamos instantes que no vuelven',
      subtitle: 'Fotografía artística para momentos únicos',
      cta: 'Contáctanos'
    },
    services: {
      title: 'Qué hacemos',
      subtitle: 'Especialistas en capturar la esencia de cada momento',
      items: [
        { id: 'bodas', title: 'Bodas', description: 'Documentamos el día más importante.' },
        { id: 'eventos', title: 'Eventos', description: 'Cobertura de eventos y celebraciones.' },
        { id: 'personal', title: 'Personal', description: 'Retratos con identidad propia.' },
        { id: 'creativos', title: 'Proyectos Creativos', description: 'Producciones visuales especiales.' }
      ]
    },
    about: {
      title: 'Por qué Vorágine',
      subtitle: 'Más que fotografía, creamos experiencias visuales',
      items: [
        { title: 'Mirada artística', description: 'Composición y narrativa visual en cada toma.' },
        { title: 'Edición cuidada', description: 'Posproducción profesional y natural.' }
      ]
    },
    process: {
      title: 'Nuestro proceso',
      subtitle: 'Un viaje creativo juntos',
      steps: [
        { number: '01', title: 'Brief', description: 'Entendemos tu proyecto.' },
        { number: '02', title: 'Producción', description: 'Planificamos cada detalle.' },
        { number: '03', title: 'Cobertura', description: 'Capturamos el momento.' },
        { number: '04', title: 'Entrega', description: 'Entregamos material final.' }
      ]
    },
    cta: {
      title: 'Cuéntanos qué quieres capturar',
      subtitle: 'Estamos aquí para escuchar tu historia',
      button: 'Escríbenos'
    }
  },
  settings: {
    _id: '50',
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
    branding: {
      logo: '',
      favicon: ''
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
      defaultDescription: 'Fotografía para bodas, eventos y retratos.',
      defaultOgImage: '',
      twitterHandle: '',
      locale: 'es_ES',
      siteUrl: 'https://voragine.vercel.app'
    },
    business: {
      legalName: 'Vorágine Estudio',
      city: 'Madrid',
      country: 'España',
      openingHours: ['Mon-Fri 10:00-19:00']
    }
  }
};

const normalizeBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const findById = (collection, id) => collection.find((item) => item._id === id);
const findBySlug = (collection, slug) => collection.find((item) => item.slug === slug);
const withoutPassword = (admin) => {
  const { password, ...safe } = admin;
  return safe;
};

const getAuthUser = (req) => {
  const token = req.header('authorization')?.replace('Bearer ', '');
  if (token !== DEMO_TOKEN) return null;
  return state.admins.find((admin) => admin._id === '1') || null;
};

const requireAuth = (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated (fallback mode)' });
    return null;
  }
  return user;
};

const requireAdmin = (req, res) => {
  const user = requireAuth(req, res);
  if (!user) return null;
  if (user.role !== 'admin') {
    res.status(403).json({ error: 'Insufficient permissions' });
    return null;
  }
  return user;
};

const withCategoryObject = (project) => ({
  ...project,
  category: state.categories.find((cat) => cat._id === project.category)
    ? {
      _id: state.categories.find((cat) => cat._id === project.category)._id,
      name: state.categories.find((cat) => cat._id === project.category).name,
      slug: state.categories.find((cat) => cat._id === project.category).slug
    }
    : null
});

const parseSegments = (path) => path.split('/').filter(Boolean);

const listWithFilters = (collection, query) => {
  const includeInactive = normalizeBoolean(query.includeInactive, false);
  const onlyActive = includeInactive ? collection : collection.filter((item) => item.active !== false);
  return onlyActive;
};

const upsertById = (collection, id, payload) => {
  const index = collection.findIndex((item) => item._id === id);
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...payload };
  return collection[index];
};

const deleteById = (collection, id) => {
  const index = collection.findIndex((item) => item._id === id);
  if (index === -1) return false;
  collection.splice(index, 1);
  return true;
};

const json = (res, status, payload) => res.status(status).json(payload);

const fallbackHandler = (req, res) => {
  const segments = parseSegments(req.path);
  const [resource, id, subresource, subId] = segments;
  const method = req.method.toUpperCase();

  if (resource === 'admin' && id === 'login' && method === 'POST') {
    const { username, password } = req.body || {};
    const user = state.admins.find((admin) => admin.username === username && admin.password === password && admin.active !== false);
    if (!user) return json(res, 401, { error: 'Invalid credentials' });
    return json(res, 200, { token: DEMO_TOKEN, admin: withoutPassword(user), fallback: true });
  }

  if (resource === 'admin' && id === 'me' && method === 'GET') {
    const user = requireAuth(req, res);
    if (!user) return true;
    return json(res, 200, withoutPassword(user));
  }

  if (resource === 'admin' && id === 'users' && method === 'GET') {
    if (!requireAdmin(req, res)) return true;
    return json(res, 200, state.admins.map(withoutPassword));
  }

  if (resource === 'admin' && id === 'users' && method === 'POST') {
    if (!requireAdmin(req, res)) return true;
    const payload = req.body || {};
    const user = {
      _id: nextId(),
      username: payload.username,
      password: payload.password || 'editor12345',
      email: payload.email,
      name: payload.name || payload.username,
      role: payload.role || 'editor',
      active: payload.active !== false
    };
    state.admins.push(user);
    return json(res, 201, withoutPassword(user));
  }

  if (resource === 'admin' && id === 'users' && subresource && method === 'PUT') {
    if (!requireAdmin(req, res)) return true;
    const updated = upsertById(state.admins, subresource, req.body || {});
    if (!updated) return json(res, 404, { error: 'User not found' });
    return json(res, 200, withoutPassword(updated));
  }

  if (resource === 'public' && id === 'bootstrap' && method === 'GET') {
    return json(res, 200, {
      settings: state.settings,
      pages: state.pages.filter((item) => item.active !== false),
      services: state.services.filter((item) => item.active !== false),
      categories: state.categories.filter((item) => item.active !== false),
      projects: state.projects.filter((item) => item.active !== false).map(withCategoryObject),
      posts: state.posts.filter((item) => item.active !== false && item.published !== false),
      testimonials: state.testimonials.filter((item) => item.active !== false)
    });
  }

  if (resource === 'settings') {
    if (method === 'GET') return json(res, 200, state.settings);
    if (method === 'PUT') {
      if (!requireAuth(req, res)) return true;
      state.settings = { ...state.settings, ...(req.body || {}) };
      return json(res, 200, state.settings);
    }
  }

  if (resource === 'content') {
    if (method === 'GET') {
      if (!id) return json(res, 200, state.content);
      return json(res, 200, { section: id, data: state.content[id] || {} });
    }
    if (method === 'PUT' && id) {
      if (!requireAuth(req, res)) return true;
      state.content[id] = (req.body || {}).data || {};
      return json(res, 200, { section: id, data: state.content[id] });
    }
  }

  const crudMap = {
    categories: state.categories,
    services: state.services,
    pages: state.pages,
    posts: state.posts,
    testimonials: state.testimonials
  };

  if (resource in crudMap) {
    const collection = crudMap[resource];

    if (method === 'GET' && !id) {
      if (resource === 'posts') {
        const includeInactive = normalizeBoolean(req.query.includeInactive, false);
        const includeDrafts = normalizeBoolean(req.query.includeDrafts, false);
        let posts = includeInactive ? collection : collection.filter((item) => item.active !== false);
        if (!includeDrafts) posts = posts.filter((item) => item.published !== false);
        return json(res, 200, posts.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()));
      }
      return json(res, 200, listWithFilters(collection, req.query));
    }

    if (method === 'GET' && id) {
      const match = findBySlug(collection, id);
      if (!match) return json(res, 404, { error: 'Not found' });
      return json(res, 200, match);
    }

    if (method === 'POST') {
      if (!requireAuth(req, res)) return true;
      const payload = req.body || {};
      const item = { ...payload, _id: nextId() };
      if (!item.slug && item.title) item.slug = item.title.toLowerCase().replace(/\s+/g, '-');
      collection.push(item);
      return json(res, 201, item);
    }

    if (method === 'PUT' && id) {
      if (!requireAuth(req, res)) return true;
      const updated = upsertById(collection, id, req.body || {});
      if (!updated) return json(res, 404, { error: 'Not found' });
      return json(res, 200, updated);
    }

    if (method === 'DELETE' && id) {
      if (!requireAdmin(req, res)) return true;
      if (!deleteById(collection, id)) return json(res, 404, { error: 'Not found' });
      return json(res, 200, { message: 'Deleted' });
    }
  }

  if (resource === 'projects' || resource === 'galleries') {
    if (method === 'GET' && !id) {
      const includeInactive = normalizeBoolean(req.query.includeInactive, false);
      const featured = normalizeBoolean(req.query.featured, false);
      let items = includeInactive ? state.projects : state.projects.filter((item) => item.active !== false);
      if (featured) items = items.filter((item) => item.featured === true);
      if (req.query.category) {
        const category = state.categories.find((cat) => cat.slug === req.query.category);
        if (category) items = items.filter((item) => item.category === category._id);
      }
      return json(res, 200, items.map(withCategoryObject));
    }

    if (method === 'GET' && id) {
      const project = findBySlug(state.projects, id);
      if (!project) return json(res, 404, { error: 'Project not found' });
      return json(res, 200, withCategoryObject(project));
    }

    if (method === 'POST' && !id) {
      if (!requireAuth(req, res)) return true;
      const payload = req.body || {};
      const project = {
        ...payload,
        _id: nextId(),
        images: payload.images || [],
        createdAt: nowIso()
      };
      state.projects.push(project);
      return json(res, 201, withCategoryObject(project));
    }

    if (method === 'PUT' && id && !subresource) {
      if (!requireAuth(req, res)) return true;
      const updated = upsertById(state.projects, id, req.body || {});
      if (!updated) return json(res, 404, { error: 'Project not found' });
      return json(res, 200, withCategoryObject(updated));
    }

    if (method === 'DELETE' && id && !subresource) {
      if (!requireAdmin(req, res)) return true;
      if (!deleteById(state.projects, id)) return json(res, 404, { error: 'Project not found' });
      return json(res, 200, { message: 'Project deleted' });
    }

    if (subresource === 'images' && method === 'POST') {
      if (!requireAuth(req, res)) return true;
      const project = findById(state.projects, id);
      if (!project) return json(res, 404, { error: 'Project not found' });
      project.images = [...(project.images || []), ...((req.body || {}).images || [])];
      return json(res, 200, withCategoryObject(project));
    }

    if (subresource === 'images' && subId && method === 'DELETE') {
      if (!requireAuth(req, res)) return true;
      const project = findById(state.projects, id);
      if (!project) return json(res, 404, { error: 'Project not found' });
      project.images = (project.images || []).filter((image) => String(image._id || image.url) !== subId);
      return json(res, 200, withCategoryObject(project));
    }
  }

  if (resource === 'contact') {
    if (method === 'POST' && !id) {
      if ((req.body || {}).website) return json(res, 202, { message: 'Submission accepted' });
      const payload = req.body || {};
      const message = {
        _id: nextId(),
        name: payload.name,
        email: payload.email,
        phone: payload.phone || '',
        projectType: payload.projectType || 'otro',
        message: payload.message || '',
        read: false,
        archived: false,
        createdAt: nowIso()
      };
      state.messages.unshift(message);
      return json(res, 201, { message: 'Message sent successfully', id: message._id, fallback: true });
    }

    if (method === 'GET' && !id) {
      if (!requireAuth(req, res)) return true;
      const unread = normalizeBoolean(req.query.unread, false);
      const archived = normalizeBoolean(req.query.archived, false);
      let list = [...state.messages];
      if (unread) list = list.filter((item) => item.read === false);
      if (!archived) list = list.filter((item) => item.archived === false);
      return json(res, 200, list);
    }

    if (method === 'GET' && id) {
      if (!requireAuth(req, res)) return true;
      const message = findById(state.messages, id);
      if (!message) return json(res, 404, { error: 'Message not found' });
      message.read = true;
      return json(res, 200, message);
    }

    if (method === 'PUT' && subresource === 'archive') {
      if (!requireAuth(req, res)) return true;
      const message = findById(state.messages, id);
      if (!message) return json(res, 404, { error: 'Message not found' });
      message.archived = true;
      return json(res, 200, message);
    }

    if (method === 'DELETE' && id) {
      if (!requireAdmin(req, res)) return true;
      if (!deleteById(state.messages, id)) return json(res, 404, { error: 'Message not found' });
      return json(res, 200, { message: 'Message deleted' });
    }
  }

  if (resource === 'export' && method === 'GET') {
    if (!requireAdmin(req, res)) return true;
    return json(res, 200, {
      exportedAt: nowIso(),
      fallback: true,
      categories: state.categories,
      projects: state.projects,
      services: state.services,
      pages: state.pages,
      posts: state.posts,
      testimonials: state.testimonials,
      settings: state.settings,
      messages: state.messages
    });
  }

  return false;
};

module.exports = {
  fallbackHandler,
  DEMO_TOKEN
};
