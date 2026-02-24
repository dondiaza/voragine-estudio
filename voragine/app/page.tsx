import type { Metadata } from 'next';
import Link from 'next/link';
import SiteFrame from '@/components/site/SiteFrame';
import PageHero from '@/components/site/PageHero';
import ServicesGrid from '@/components/site/ServicesGrid';
import PortfolioGallery from '@/components/site/PortfolioGallery';
import Testimonials from '@/components/site/Testimonials';
import BlogList from '@/components/site/BlogList';
import PageModules from '@/components/site/PageModules';
import {
  getCategories,
  getPage,
  getPosts,
  getProjects,
  getServices,
  getSettings,
  getTestimonials
} from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getPage('home')]);
  return buildPageMetadata({
    pagePath: '/',
    page,
    settings,
    fallbackTitle: 'Inicio',
    fallbackDescription: settings.seo?.defaultDescription || 'Estudio de fotografía profesional.'
  });
}

export default async function HomePage() {
  const [settings, page, services, categories, projects, testimonials, posts] = await Promise.all([
    getSettings(),
    getPage('home'),
    getServices(),
    getCategories(),
    getProjects({ featured: true }),
    getTestimonials(),
    getPosts(3)
  ]);

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow={page?.hero?.eyebrow || settings.siteName}
        title={page?.hero?.title || settings.tagline || 'Fotografía profesional'}
        subtitle={page?.hero?.subtitle || settings.seo?.defaultDescription}
        image={page?.hero?.image}
        ctaLabel={page?.hero?.ctaLabel || settings.ctas?.primaryLabel}
        ctaUrl={page?.hero?.ctaUrl || settings.ctas?.primaryUrl || '/contacto'}
      />

      <ServicesGrid services={services.slice(0, 4)} />

      <PortfolioGallery projects={projects} categories={categories} />

      <Testimonials testimonials={testimonials.filter((item) => item.featured).slice(0, 4)} />

      <PageModules modules={page?.modules} />

      <section className="section-padding bg-white">
        <div className="container-fluid flex flex-wrap items-center justify-between gap-4">
          <h2 className="heading-md text-voragine-black">Últimos artículos</h2>
          <Link href="/blog" className="btn-secondary">
            Ver blog
          </Link>
        </div>
        <BlogList posts={posts} />
      </section>
    </SiteFrame>
  );
}
