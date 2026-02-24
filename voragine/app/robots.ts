import type { MetadataRoute } from 'next';
import { getSettings, toCanonicalUrl } from '@/lib/cms';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin']
    },
    sitemap: toCanonicalUrl('/sitemap.xml', settings)
  };
}
