const fallbackApiUrl = 'http://localhost:5000/api';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || fallbackApiUrl;

const getClientToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

async function parseError(response: Response) {
  const data = await response.json().catch(() => null);
  if (data?.error) return data.error;
  if (Array.isArray(data?.details) && data.details.length) {
    return data.details[0].message;
  }
  return `Request failed (${response.status})`;
}

export async function fetchAPI<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getClientToken();
  const isFormData = options.body instanceof FormData;
  const method = (options.method || 'GET').toUpperCase();

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...((options.headers || {}) as Record<string, string>)
  };

  if (method === 'GET' && !headers['Cache-Control']) {
    headers['Cache-Control'] = 'no-cache';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const requestInit: RequestInit = {
    ...options,
    headers,
    cache: options.cache ?? 'no-store'
  };

  let response = await fetch(`${API_URL}${endpoint}`, requestInit);

  // Some browsers may surface conditional API responses as 304 without body.
  // Retry once with a cache-busting param to guarantee fresh JSON for the CMS.
  if (response.status === 304) {
    const sep = endpoint.includes('?') ? '&' : '?';
    const retryEndpoint = `${endpoint}${sep}_=${Date.now()}`;
    response = await fetch(`${API_URL}${retryEndpoint}`, {
      ...requestInit,
      cache: 'no-store'
    });
  }

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const toProjectTypeOptions = () => ([
  { value: 'bodas', label: 'Bodas' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'personal', label: 'Retratos / personal' },
  { value: 'proyectos-creativos', label: 'Proyectos creativos' },
  { value: 'otro', label: 'Otro' }
]);

export const api = {
  health: () => fetchAPI('/health'),
  public: {
    bootstrap: () => fetchAPI('/public/bootstrap')
  },
  content: {
    get: (section?: string) => fetchAPI(`/content${section ? `/${section}` : ''}`),
    update: (section: string, data: unknown) =>
      fetchAPI(`/content/${section}`, { method: 'PUT', body: JSON.stringify({ data }) })
  },
  categories: {
    getAll: (includeInactive = false) =>
      fetchAPI(`/categories${includeInactive ? '?includeInactive=true' : ''}`),
    getBySlug: (slug: string) => fetchAPI(`/categories/${slug}`),
    create: (data: unknown) => fetchAPI('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      fetchAPI(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/categories/${id}`, { method: 'DELETE' })
  },
  galleries: {
    getAll: (params?: Record<string, string | number | boolean>) => {
      const query = params ? `?${new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
      ).toString()}` : '';
      return fetchAPI(`/galleries${query}`);
    },
    getBySlug: (slug: string) => fetchAPI(`/galleries/${slug}`),
    create: (data: unknown) => fetchAPI('/galleries', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      fetchAPI(`/galleries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/galleries/${id}`, { method: 'DELETE' }),
    addImages: (id: string, images: unknown[]) =>
      fetchAPI(`/galleries/${id}/images`, { method: 'POST', body: JSON.stringify({ images }) }),
    deleteImage: (id: string, imageId: string) =>
      fetchAPI(`/galleries/${id}/images/${imageId}`, { method: 'DELETE' })
  },
  projects: {
    getAll: (params?: Record<string, string | number | boolean>) => {
      const query = params ? `?${new URLSearchParams(
        Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {})
      ).toString()}` : '';
      return fetchAPI(`/projects${query}`);
    },
    getBySlug: (slug: string) => fetchAPI(`/projects/${slug}`),
    create: (data: unknown) => fetchAPI('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      fetchAPI(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/projects/${id}`, { method: 'DELETE' })
  },
  services: {
    getAll: (includeInactive = false) =>
      fetchAPI(`/services${includeInactive ? '?includeInactive=true' : ''}`),
    getBySlug: (slug: string) => fetchAPI(`/services/${slug}`),
    create: (data: unknown) => fetchAPI('/services', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      fetchAPI(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/services/${id}`, { method: 'DELETE' })
  },
  pages: {
    getAll: (includeInactive = false) =>
      fetchAPI(`/pages${includeInactive ? '?includeInactive=true' : ''}`),
    getBySlug: (slug: string) => fetchAPI(`/pages/${slug}`),
    create: (data: unknown) => fetchAPI('/pages', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      fetchAPI(`/pages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/pages/${id}`, { method: 'DELETE' })
  },
  posts: {
    getAll: (includeInactive = false, includeDrafts = false) =>
      fetchAPI(`/posts?includeInactive=${includeInactive}&includeDrafts=${includeDrafts}`),
    getBySlug: (slug: string) => fetchAPI(`/posts/${slug}?includeDraft=true`),
    create: (data: unknown) => fetchAPI('/posts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      fetchAPI(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/posts/${id}`, { method: 'DELETE' })
  },
  testimonials: {
    getAll: (includeInactive = false) =>
      fetchAPI(`/testimonials${includeInactive ? '?includeInactive=true' : ''}`),
    create: (data: unknown) => fetchAPI('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      fetchAPI(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/testimonials/${id}`, { method: 'DELETE' })
  },
  contact: {
    send: (data: unknown) => fetchAPI('/contact', { method: 'POST', body: JSON.stringify(data) }),
    getAll: (params?: { unread?: string; archived?: string }) => {
      const searchParams = new URLSearchParams({
        ...(params as Record<string, string> | undefined),
        _ts: Date.now().toString()
      });
      const query = `?${searchParams.toString()}`;
      return fetchAPI(`/contact${query}`);
    },
    getById: (id: string) => fetchAPI(`/contact/${id}`),
    archive: (id: string) => fetchAPI(`/contact/${id}/archive`, { method: 'PUT' }),
    delete: (id: string) => fetchAPI(`/contact/${id}`, { method: 'DELETE' })
  },
  settings: {
    get: () => fetchAPI('/settings'),
    update: (data: unknown) => fetchAPI('/settings', { method: 'PUT', body: JSON.stringify(data) })
  },
  admin: {
    login: (username: string, password: string) =>
      fetchAPI<{ token: string }>('/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
    getMe: () => fetchAPI('/admin/me'),
    changePassword: (currentPassword: string, newPassword: string) =>
      fetchAPI('/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      }),
    getUsers: () => fetchAPI('/admin/users'),
    createUser: (data: unknown) => fetchAPI('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    updateUser: (id: string, data: unknown) =>
      fetchAPI(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  upload: {
    image: async (file: File, type = 'general') => {
      const formData = new FormData();
      formData.append('image', file);
      return fetchAPI(`/upload/${type}`, { method: 'POST', body: formData });
    },
    multiple: async (files: File[], type = 'general') => {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      return fetchAPI(`/upload/multiple/${type}`, { method: 'POST', body: formData });
    },
    remove: (type: string, filename: string) =>
      fetchAPI(`/upload/${type}/${filename}`, { method: 'DELETE' })
  },
  export: {
    cms: () => fetchAPI('/export')
  }
};
