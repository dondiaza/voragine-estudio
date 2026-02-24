import type { Metadata } from 'next';
import SiteFrame from '@/components/site/SiteFrame';
import PageHero from '@/components/site/PageHero';
import PortfolioGallery from '@/components/site/PortfolioGallery';
import PageModules from '@/components/site/PageModules';
import { getCategories, getPage, getProjects, getSettings } from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getPage('portfolio')]);
  return buildPageMetadata({
    pagePath: '/portfolio',
    page,
    settings,
    fallbackTitle: 'Portfolio',
    fallbackDescription: 'Galerías y casos reales de fotografía.'
  });
}

export default async function PortfolioPage() {
  const [settings, page, categories, projects] = await Promise.all([
    getSettings(),
    getPage('portfolio'),
    getCategories(),
    getProjects()
  ]);

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow={page?.hero?.eyebrow || 'Portfolio'}
        title={page?.hero?.title || 'Casos y galerías'}
        subtitle={page?.hero?.subtitle}
        image={page?.hero?.image}
        ctaLabel={page?.hero?.ctaLabel}
        ctaUrl={page?.hero?.ctaUrl}
      />
      <PortfolioGallery categories={categories} projects={projects} />
      <PageModules modules={page?.modules} />
    </SiteFrame>
  );
}
