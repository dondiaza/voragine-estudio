import type { Metadata } from 'next';
import SiteFrame from '@/components/site/SiteFrame';
import PageHero from '@/components/site/PageHero';
import ServicesGrid from '@/components/site/ServicesGrid';
import PageModules from '@/components/site/PageModules';
import { getPage, getServices, getSettings } from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getPage('servicios')]);
  return buildPageMetadata({
    pagePath: '/servicios',
    page,
    settings,
    fallbackTitle: 'Servicios',
    fallbackDescription: 'Conoce nuestros servicios de fotografía.'
  });
}

export default async function ServicesPage() {
  const [settings, page, services] = await Promise.all([
    getSettings(),
    getPage('servicios'),
    getServices()
  ]);

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow={page?.hero?.eyebrow || 'Servicios'}
        title={page?.hero?.title || 'Servicios de fotografía'}
        subtitle={page?.hero?.subtitle}
        image={page?.hero?.image}
        ctaLabel={page?.hero?.ctaLabel || settings.ctas?.primaryLabel}
        ctaUrl={page?.hero?.ctaUrl || settings.ctas?.primaryUrl}
      />
      <ServicesGrid services={services} />
      <PageModules modules={page?.modules} />
    </SiteFrame>
  );
}
