import type { Metadata } from 'next';
import SiteFrame from '@/components/site/SiteFrame';
import PageHero from '@/components/site/PageHero';
import BlogList from '@/components/site/BlogList';
import PageModules from '@/components/site/PageModules';
import { getPage, getPosts, getSettings } from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getPage('blog')]);
  return buildPageMetadata({
    pagePath: '/blog',
    page,
    settings,
    fallbackTitle: 'Blog',
    fallbackDescription: 'Artículos y noticias del estudio.'
  });
}

export default async function BlogPage() {
  const [settings, page, posts] = await Promise.all([
    getSettings(),
    getPage('blog'),
    getPosts()
  ]);

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow={page?.hero?.eyebrow || 'Blog'}
        title={page?.hero?.title || 'Noticias y artículos'}
        subtitle={page?.hero?.subtitle}
        image={page?.hero?.image}
      />
      <BlogList posts={posts} />
      <PageModules modules={page?.modules} />
    </SiteFrame>
  );
}
