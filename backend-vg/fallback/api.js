const crypto = require('crypto');
const { list, put } = require('@vercel/blob');

const DEMO_TOKEN = 'demo-token-12345';
const FALLBACK_STATE_PATH = process.env.FALLBACK_STATE_PATH || 'voragine/fallback-state.json';
const FALLBACK_STATE_PREFIX = (() => {
  if (FALLBACK_STATE_PATH.endsWith('/')) return FALLBACK_STATE_PATH;
  if (FALLBACK_STATE_PATH.endsWith('.json')) return `${FALLBACK_STATE_PATH.replace(/\.json$/i, '')}/`;
  return `${FALLBACK_STATE_PATH}/`;
})();
const FALLBACK_ADMIN_USERNAME = (process.env.FALLBACK_ADMIN_USERNAME || 'admin').trim();
const FALLBACK_ADMIN_PASSWORD = (process.env.FALLBACK_ADMIN_PASSWORD || 'admin12345').trim();
const FALLBACK_ADMIN_EMAIL = (process.env.FALLBACK_ADMIN_EMAIL || 'admin@voragineestudio.com').trim();
const FALLBACK_ADMIN_NAME = (process.env.FALLBACK_ADMIN_NAME || 'Administrador').trim();
const FALLBACK_STATE_SECRET = (process.env.FALLBACK_STATE_SECRET || process.env.JWT_SECRET || 'fallback-state-secret').trim();

let idSeq = 1000;
const nextId = () => String(++idSeq);

const nowIso = () => new Date().toISOString();
const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);
const getBlobToken = () => (process.env.BLOB_READ_WRITE_TOKEN || '').trim();
const getStateCipherKey = () => crypto.createHash('sha256').update(FALLBACK_STATE_SECRET).digest();

const encryptStatePayload = (plainText) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getStateCipherKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return JSON.stringify({
    v: 1,
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64')
  });
};

const decryptStatePayload = (cipherText) => {
  if (!cipherText) return '';

  try {
    const payload = JSON.parse(cipherText);
    if (payload && payload.v === 1 && payload.iv && payload.tag && payload.data) {
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        getStateCipherKey(),
        Buffer.from(payload.iv, 'base64')
      );
      decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(payload.data, 'base64')),
        decipher.final()
      ]);
      return decrypted.toString('utf8');
    }
  } catch (_error) {
    // Backward compatibility for plain JSON payloads.
  }

  return cipherText;
};

const createInitialState = () => ({
  admins: [
    {
      _id: '1',
      username: FALLBACK_ADMIN_USERNAME,
      password: FALLBACK_ADMIN_PASSWORD,
      email: FALLBACK_ADMIN_EMAIL,
      name: FALLBACK_ADMIN_NAME,
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
});

const ensureFallbackAdmin = (admins) => {
  const list = Array.isArray(admins) ? admins.filter(isObject) : [];
  const key = FALLBACK_ADMIN_USERNAME.toLowerCase();
  const existing = list.find((admin) => String(admin.username || '').toLowerCase() === key);

  if (existing) {
    existing.active = existing.active !== false;
    existing.role = existing.role || 'admin';
    existing.name = existing.name || FALLBACK_ADMIN_NAME;
    existing.email = existing.email || FALLBACK_ADMIN_EMAIL;
    return list;
  }

  list.unshift({
    _id: '1',
    username: FALLBACK_ADMIN_USERNAME,
    password: FALLBACK_ADMIN_PASSWORD,
    email: FALLBACK_ADMIN_EMAIL,
    name: FALLBACK_ADMIN_NAME,
    role: 'admin',
    active: true,
    createdAt: nowIso()
  });

  return list;
};

const mergeState = (candidate) => {
  const base = createInitialState();
  if (!isObject(candidate)) {
    return base;
  }

  const mergedSettings = isObject(candidate.settings) ? candidate.settings : {};
  return {
    ...base,
    ...candidate,
    admins: ensureFallbackAdmin(candidate.admins ?? base.admins),
    categories: Array.isArray(candidate.categories) ? candidate.categories : base.categories,
    services: Array.isArray(candidate.services) ? candidate.services : base.services,
    projects: Array.isArray(candidate.projects) ? candidate.projects : base.projects,
    pages: Array.isArray(candidate.pages) ? candidate.pages : base.pages,
    posts: Array.isArray(candidate.posts) ? candidate.posts : base.posts,
    testimonials: Array.isArray(candidate.testimonials) ? candidate.testimonials : base.testimonials,
    messages: Array.isArray(candidate.messages) ? candidate.messages : base.messages,
    content: isObject(candidate.content) ? candidate.content : base.content,
    settings: {
      ...base.settings,
      ...mergedSettings,
      social: { ...base.settings.social, ...(isObject(mergedSettings.social) ? mergedSettings.social : {}) },
      branding: { ...base.settings.branding, ...(isObject(mergedSettings.branding) ? mergedSettings.branding : {}) },
      ctas: { ...base.settings.ctas, ...(isObject(mergedSettings.ctas) ? mergedSettings.ctas : {}) },
      seo: { ...base.settings.seo, ...(isObject(mergedSettings.seo) ? mergedSettings.seo : {}) },
      business: { ...base.settings.business, ...(isObject(mergedSettings.business) ? mergedSettings.business : {}) }
    }
  };
};

const computeMaxId = (value) => {
  let max = 0;
  const stack = [value];

  while (stack.length) {
    const current = stack.pop();
    if (Array.isArray(current)) {
      for (const item of current) stack.push(item);
      continue;
    }
    if (!isObject(current)) {
      continue;
    }
    if (typeof current._id === 'string' && /^\d+$/.test(current._id)) {
      max = Math.max(max, Number(current._id));
    }
    for (const nested of Object.values(current)) {
      stack.push(nested);
    }
  }

  return max;
};

let state = mergeState(createInitialState());
let stateSynced = false;
let syncInFlight = null;
let persistQueue = Promise.resolve();
idSeq = Math.max(1000, computeMaxId(state));

const persistStateNow = async () => {
  const token = getBlobToken();
  if (!token) return;

  const serialized = JSON.stringify(state);
  const encrypted = encryptStatePayload(serialized);
  const statePathname = `${FALLBACK_STATE_PREFIX}${Date.now()}-${Math.round(Math.random() * 1e9)}.json`;
  await put(statePathname, encrypted, {
    access: 'public',
    token,
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: 'application/octet-stream',
    cacheControlMaxAge: 60
  });
};

const queueStatePersist = () => {
  const token = getBlobToken();
  if (!token) return Promise.resolve();

  persistQueue = persistQueue
    .catch(() => undefined)
    .then(() => persistStateNow());
  return persistQueue;
};

const syncStateFromBlob = async () => {
  const token = getBlobToken();
  if (!token) {
    stateSynced = true;
    idSeq = Math.max(1000, computeMaxId(state));
    return;
  }

  if (syncInFlight) {
    await syncInFlight;
    return;
  }

  syncInFlight = (async () => {
    try {
      let listed = await list({
        token,
        prefix: FALLBACK_STATE_PREFIX,
        limit: 25
      });
      let candidates = listed.blobs || [];

      if (candidates.length === 0) {
        listed = await list({
          token,
          prefix: FALLBACK_STATE_PATH,
          limit: 1
        });
        candidates = (listed.blobs || []).filter((blob) => blob.pathname === FALLBACK_STATE_PATH);
      }

      const latest = candidates
        .slice()
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
      const blobUrl = latest?.url || null;

      if (!blobUrl) {
        state = mergeState(createInitialState());
        await persistStateNow();
        stateSynced = true;
        idSeq = Math.max(1000, computeMaxId(state));
        return;
      }

      const response = await fetch(blobUrl, { cache: 'no-store' });
      if (!response.ok) {
        if (response.status === 404) {
          state = mergeState(createInitialState());
          await persistStateNow();
          stateSynced = true;
          idSeq = Math.max(1000, computeMaxId(state));
          return;
        }
        throw new Error(`Blob fetch failed (${response.status})`);
      }

      const text = await response.text();
      const plainText = decryptStatePayload(text);
      const parsed = plainText ? JSON.parse(plainText) : {};
      state = mergeState(parsed);
      stateSynced = true;
      idSeq = Math.max(1000, computeMaxId(state));
    } catch (error) {
      console.log('fallback.state.sync.error', error instanceof Error ? error.message : error);
      if (!stateSynced) {
        state = mergeState(state);
        stateSynced = true;
        idSeq = Math.max(1000, computeMaxId(state));
      }
    } finally {
      syncInFlight = null;
    }
  })();

  await syncInFlight;
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

  const adminKey = FALLBACK_ADMIN_USERNAME.toLowerCase();
  return (
    state.admins.find((admin) => String(admin.username || '').toLowerCase() === adminKey) ||
    state.admins.find((admin) => admin.role === 'admin' && admin.active !== false) ||
    null
  );
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

const withCategoryObject = (project) => {
  const category = state.categories.find((cat) => cat._id === project.category);
  return {
    ...project,
    category: category
      ? {
        _id: category._id,
        name: category.name,
        slug: category.slug
      }
      : null
  };
};

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

const fallbackHandler = async (req, res) => {
  await syncStateFromBlob();

  const persistResponse = async (status, payload) => {
    try {
      await queueStatePersist();
      return json(res, status, payload);
    } catch (error) {
      console.log('fallback.state.persist.error', error instanceof Error ? error.message : error);
      return json(res, 503, { error: 'Persistence error (fallback mode)' });
    }
  };

  const segments = parseSegments(req.path);
  const [resource, id, subresource, subId] = segments;
  const method = req.method.toUpperCase();

  if (resource === 'admin' && id === 'login' && method === 'POST') {
    const { username, password } = req.body || {};
    const loginKey = String(username || '').trim().toLowerCase();
    const user = state.admins.find((admin) => {
      const userName = String(admin.username || '').trim().toLowerCase();
      const userEmail = String(admin.email || '').trim().toLowerCase();
      const matchIdentity = loginKey === userName || loginKey === userEmail;
      return matchIdentity && admin.password === password && admin.active !== false;
    });

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
    return persistResponse(201, withoutPassword(user));
  }

  if (resource === 'admin' && id === 'users' && subresource && method === 'PUT') {
    if (!requireAdmin(req, res)) return true;
    const updated = upsertById(state.admins, subresource, req.body || {});
    if (!updated) return json(res, 404, { error: 'User not found' });
    return persistResponse(200, withoutPassword(updated));
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
      return persistResponse(200, state.settings);
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
      return persistResponse(200, { section: id, data: state.content[id] });
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
      return persistResponse(201, item);
    }

    if (method === 'PUT' && id) {
      if (!requireAuth(req, res)) return true;
      const updated = upsertById(collection, id, req.body || {});
      if (!updated) return json(res, 404, { error: 'Not found' });
      return persistResponse(200, updated);
    }

    if (method === 'DELETE' && id) {
      if (!requireAdmin(req, res)) return true;
      if (!deleteById(collection, id)) return json(res, 404, { error: 'Not found' });
      return persistResponse(200, { message: 'Deleted' });
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
      return persistResponse(201, withCategoryObject(project));
    }

    if (method === 'PUT' && id && !subresource) {
      if (!requireAuth(req, res)) return true;
      const updated = upsertById(state.projects, id, req.body || {});
      if (!updated) return json(res, 404, { error: 'Project not found' });
      return persistResponse(200, withCategoryObject(updated));
    }

    if (method === 'DELETE' && id && !subresource) {
      if (!requireAdmin(req, res)) return true;
      if (!deleteById(state.projects, id)) return json(res, 404, { error: 'Project not found' });
      return persistResponse(200, { message: 'Project deleted' });
    }

    if (subresource === 'images' && method === 'POST') {
      if (!requireAuth(req, res)) return true;
      const project = findById(state.projects, id);
      if (!project) return json(res, 404, { error: 'Project not found' });
      project.images = [...(project.images || []), ...((req.body || {}).images || [])];
      return persistResponse(200, withCategoryObject(project));
    }

    if (subresource === 'images' && subId && method === 'DELETE') {
      if (!requireAuth(req, res)) return true;
      const project = findById(state.projects, id);
      if (!project) return json(res, 404, { error: 'Project not found' });
      project.images = (project.images || []).filter((image) => String(image._id || image.url) !== subId);
      return persistResponse(200, withCategoryObject(project));
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
      return persistResponse(201, { message: 'Message sent successfully', id: message._id, fallback: true });
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
      return persistResponse(200, message);
    }

    if (method === 'PUT' && subresource === 'archive') {
      if (!requireAuth(req, res)) return true;
      const message = findById(state.messages, id);
      if (!message) return json(res, 404, { error: 'Message not found' });
      message.archived = true;
      return persistResponse(200, message);
    }

    if (method === 'DELETE' && id) {
      if (!requireAdmin(req, res)) return true;
      if (!deleteById(state.messages, id)) return json(res, 404, { error: 'Message not found' });
      return persistResponse(200, { message: 'Message deleted' });
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
