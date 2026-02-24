import type { Metadata } from 'next';
import SiteFrame from '@/components/site/SiteFrame';
import PageHero from '@/components/site/PageHero';
import PageModules from '@/components/site/PageModules';
import Testimonials from '@/components/site/Testimonials';
import { getPage, getSettings, getTestimonials } from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getPage('sobre-nosotros')]);
  return buildPageMetadata({
    pagePath: '/sobre-nosotros',
    page,
    settings,
    fallbackTitle: 'Sobre nosotros',
    fallbackDescription: 'Conoce al equipo de Vorágine Estudio.'
  });
}

export default async function AboutPage() {
  const [settings, page, testimonials] = await Promise.all([
    getSettings(),
    getPage('sobre-nosotros'),
    getTestimonials()
  ]);

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow={page?.hero?.eyebrow || 'Sobre nosotros'}
        title={page?.hero?.title || 'Equipo Vorágine'}
        subtitle={page?.hero?.subtitle}
        image={page?.hero?.image}
        ctaLabel={page?.hero?.ctaLabel}
        ctaUrl={page?.hero?.ctaUrl}
      />
      <PageModules modules={page?.modules} />
      <Testimonials testimonials={testimonials} />
    </SiteFrame>
  );
}
