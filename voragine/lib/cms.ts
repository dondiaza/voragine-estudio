import { cache } from 'react';

const FALLBACK_API_URL = 'http://localhost:5000/api';

export const CMS_API_URL =
  process.env.CMS_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  FALLBACK_API_URL;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export type SeoConfig = {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
  active?: boolean;
};

export type ProjectImage = {
  _id?: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  order?: number;
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category?: Category;
  tags?: string[];
  images: ProjectImage[];
  coverImage?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
  seo?: SeoConfig;
  createdAt?: string;
};

export type Service = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  coverImage?: string;
  gallery?: string[];
  tags?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  featured?: boolean;
  order?: number;
  active?: boolean;
  seo?: SeoConfig;
};

export type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  rating?: number;
  avatar?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
};

export type PageModule = {
  type: string;
  heading?: string;
  body?: string;
  image?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  items?: Array<Record<string, unknown>>;
  order?: number;
};

export type Page = {
  _id: string;
  name: string;
  slug: string;
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    image?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
  modules?: PageModule[];
  seo?: SeoConfig;
  active?: boolean;
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishedAt?: string;
  published?: boolean;
  active?: boolean;
  seo?: SeoConfig;
};

export type SiteSettings = {
  siteName: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  social?: Record<string, string>;
  branding?: {
    logo?: string;
    favicon?: string;
  };
  ctas?: {
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
  };
  seo?: {
    defaultTitle?: string;
    titleSuffix?: string;
    defaultDescription?: string;
    defaultOgImage?: string;
    twitterHandle?: string;
    locale?: string;
    siteUrl?: string;
  };
  business?: {
    legalName?: string;
    city?: string;
    country?: string;
    openingHours?: string[];
    latitude?: number | null;
    longitude?: number | null;
  };
};

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

export const resolveMediaUrl = (value?: string | null): string => {
  if (!value) return '';
  if (isAbsoluteUrl(value)) return value;
  if (value.startsWith('/uploads')) {
    const host = CMS_API_URL.endsWith('/api') ? CMS_API_URL.replace(/\/api$/, '') : CMS_API_URL;
    return `${host}${value}`;
  }
  return value;
};

const getSiteOrigin = (settings?: SiteSettings | null) => {
  const configured = settings?.seo?.siteUrl?.trim();
  return configured || SITE_URL;
};

export const toCanonicalUrl = (path: string, settings?: SiteSettings | null) => {
  if (!path) return getSiteOrigin(settings);
  if (isAbsoluteUrl(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteOrigin(settings).replace(/\/$/, '')}${normalizedPath}`;
};

type FetchOptions = RequestInit & {
  nextRevalidate?: number;
};

async function fetchFromCms<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { nextRevalidate = 120, ...rest } = options;
  const response = await fetch(`${CMS_API_URL}${endpoint}`, {
    ...rest,
    next: { revalidate: nextRevalidate }
  });

  if (!response.ok) {
    throw new Error(`CMS request failed: ${endpoint} (${response.status})`);
  }

  return response.json() as Promise<T>;
}

async function fetchSafe<T>(endpoint: string, fallback: T, options: FetchOptions = {}): Promise<T> {
  try {
    return await fetchFromCms<T>(endpoint, options);
  } catch {
    return fallback;
  }
}

export const getSettings = cache(async () =>
  fetchSafe<SiteSettings>('/settings', {
    siteName: 'Vorágine Estudio',
    tagline: 'Fotografía profesional',
    seo: {
      defaultTitle: 'Vorágine Estudio | Fotografía profesional',
      defaultDescription: 'Estudio de fotografía profesional para bodas, eventos y retratos.',
      siteUrl: SITE_URL,
      locale: 'es_ES',
      titleSuffix: 'Vorágine Estudio'
    }
  })
);

export const getPage = cache(async (slug: string) =>
  fetchSafe<Page | null>(`/pages/${slug}`, null)
);

export const getPages = cache(async () =>
  fetchSafe<Page[]>('/pages', [])
);

export const getServices = cache(async () =>
  fetchSafe<Service[]>('/services', [])
);

export const getCategories = cache(async () =>
  fetchSafe<Category[]>('/categories', [])
);

export const getProjects = cache(async (params?: Record<string, string | number | boolean>) => {
  const query = params
    ? `?${new URLSearchParams(
      Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {})
    ).toString()}`
    : '';
  return fetchSafe<Project[]>(`/projects${query}`, []);
});

export const getProjectBySlug = cache(async (slug: string) =>
  fetchSafe<Project | null>(`/projects/${slug}`, null)
);

export const getTestimonials = cache(async () =>
  fetchSafe<Testimonial[]>('/testimonials', [])
);

export const getPosts = cache(async (limit?: number) =>
  fetchSafe<Post[]>(`/posts${limit ? `?limit=${limit}` : ''}`, [])
);

export const getPostBySlug = cache(async (slug: string) =>
  fetchSafe<Post | null>(`/posts/${slug}`, null)
);
