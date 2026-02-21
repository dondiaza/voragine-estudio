// Prefer explicit env var; otherwise, adapt based on deployment context
export const API_URL = process.env.NEXT_PUBLIC_API_URL || (
  typeof window !== 'undefined'
    ? (window.location.hostname.endsWith('.vercel.app')
        ? 'https://backend-vg.vercel.app/api'
        : '/api')
    : '/api'
);

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
}

export const api = {
  content: {
    get: (section?: string) => fetchAPI(`/content${section ? `/${section}` : ''}`),
    update: (section: string, data: unknown) => 
      fetchAPI(`/content/${section}`, { method: 'PUT', body: JSON.stringify({ data }) }),
  },
  
  categories: {
    getAll: () => fetchAPI('/categories'),
    getBySlug: (slug: string) => fetchAPI(`/categories/${slug}`),
    create: (data: unknown) => fetchAPI('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => 
      fetchAPI(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/categories/${id}`, { method: 'DELETE' }),
  },
  
  galleries: {
    getAll: (params?: { category?: string; featured?: boolean; limit?: number }) => {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      return fetchAPI(`/galleries${query ? `?${query}` : ''}`);
    },
    getBySlug: (slug: string) => fetchAPI(`/galleries/${slug}`),
    create: (data: unknown) => fetchAPI('/galleries', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => 
      fetchAPI(`/galleries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/galleries/${id}`, { method: 'DELETE' }),
    addImages: (id: string, images: unknown[]) => 
      fetchAPI(`/galleries/${id}/images`, { method: 'POST', body: JSON.stringify({ images }) }),
    deleteImage: (id: string, imageId: string) => 
      fetchAPI(`/galleries/${id}/images/${imageId}`, { method: 'DELETE' }),
  },
  
  contact: {
    send: (data: unknown) => fetchAPI('/contact', { method: 'POST', body: JSON.stringify(data) }),
    getAll: (params?: { unread?: string; archived?: string }) => {
      const query = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      return fetchAPI(`/contact${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => fetchAPI(`/contact/${id}`),
    archive: (id: string) => fetchAPI(`/contact/${id}/archive`, { method: 'PUT' }),
    delete: (id: string) => fetchAPI(`/contact/${id}`, { method: 'DELETE' }),
  },
  
  settings: {
    get: () => fetchAPI('/settings'),
    update: (data: unknown) => fetchAPI('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
  
  admin: {
    login: (username: string, password: string) => 
      fetchAPI('/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
    getMe: () => fetchAPI('/admin/me'),
    changePassword: (currentPassword: string, newPassword: string) => 
      fetchAPI('/admin/change-password', { 
        method: 'POST', 
        body: JSON.stringify({ currentPassword, newPassword }) 
      }),
  },
  
  upload: {
    image: async (file: File, type: string = 'general') => {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/upload/${type}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    
    multiple: async (files: File[], type: string = 'general') => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/upload/multiple/${type}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
  },
};
