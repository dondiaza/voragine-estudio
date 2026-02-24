import type { MetadataRoute } from 'next';
import { getPages, getPosts, getProjects, getSettings, toCanonicalUrl } from '@/lib/cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, pages, posts, projects] = await Promise.all([
    getSettings(),
    getPages(),
    getPosts(),
    getProjects()
  ]);

  const coreRoutes = ['/', '/servicios', '/portfolio', '/sobre-nosotros', '/contacto', '/blog'];
  const items: MetadataRoute.Sitemap = coreRoutes.map((route) => ({
    url: toCanonicalUrl(route, settings),
    lastModified: new Date()
  }));

  pages.forEach((page) => {
    const route = page.slug === 'home' ? '/' : `/${page.slug}`;
    items.push({
      url: toCanonicalUrl(route, settings),
      lastModified: new Date()
    });
  });

  posts.forEach((post) => {
    items.push({
      url: toCanonicalUrl(`/blog/${post.slug}`, settings),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date()
    });
  });

  projects.forEach((project) => {
    items.push({
      url: toCanonicalUrl(`/portfolio/${project.slug}`, settings),
      lastModified: project.createdAt ? new Date(project.createdAt) : new Date()
    });
  });

  return items;
}
