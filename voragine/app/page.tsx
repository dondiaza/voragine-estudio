import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import GallerySection from '@/components/sections/GallerySection';
import AboutSection from '@/components/sections/AboutSection';
import ProcessSection from '@/components/sections/ProcessSection';
import CTASection from '@/components/sections/CTASection';
import ContactSection from '@/components/sections/ContactSection';
import { getCategories, getLegacyContent, getProjects, getSettings } from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const [settings, homePage] = await Promise.all([
    getSettings(),
    getLegacyContent()
  ]);

  return buildPageMetadata({
    pagePath: '/',
    page: {
      name: 'Home',
      slug: 'home',
      seo: {
        title: homePage.hero?.title || 'Inicio',
        description: homePage.hero?.subtitle || settings.seo?.defaultDescription,
        canonical: '/'
      }
    },
    settings,
    fallbackTitle: 'Inicio',
    fallbackDescription: settings.seo?.defaultDescription || 'Estudio de fotografía profesional.'
  });
}

export default async function HomePage() {
  const [settings, content, categories, projects] = await Promise.all([
    getSettings(),
    getLegacyContent(),
    getCategories(),
    getProjects()
  ]);

  const services = (content.services?.items || []).map((item, index) => ({
    id: item.id || `service-${index + 1}`,
    title: item.title || '',
    description: item.description || '',
    image: item.image || ''
  }));

  const aboutItems = (content.about?.items || []).map((item) => ({
    title: item.title || '',
    description: item.description || ''
  }));

  const processSteps = (content.process?.steps || []).map((step, index) => ({
    number: step.number || `${index + 1}`.padStart(2, '0'),
    title: step.title || '',
    description: step.description || ''
  }));

  const galleries = projects.map((project) => ({
    _id: project._id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    category: project.category
      ? { name: project.category.name, slug: project.category.slug }
      : { name: 'Sin categoría', slug: 'sin-categoria' },
    images: project.images || [],
    coverImage: project.coverImage,
    featured: project.featured
  }));

  return (
    <>
      <Header siteName={settings.siteName?.replace(' Estudio', '') || 'Vorágine'} />
      <main>
        <HeroSection
          title={content.hero?.title || settings.tagline}
          subtitle={content.hero?.subtitle || settings.seo?.defaultDescription}
          cta={content.hero?.cta || settings.ctas?.primaryLabel || 'Contáctanos'}
          heroImage={content.hero?.heroImage}
        />

        <ServicesSection
          title={content.services?.title}
          subtitle={content.services?.subtitle}
          services={services.length ? services : undefined}
        />

        <GallerySection galleries={galleries} categories={categories} />

        <AboutSection
          title={content.about?.title}
          subtitle={content.about?.subtitle}
          advantages={aboutItems.length ? aboutItems : undefined}
        />

        <ProcessSection
          title={content.process?.title}
          subtitle={content.process?.subtitle}
          steps={processSteps.length ? processSteps : undefined}
        />

        <CTASection
          title={content.cta?.title}
          subtitle={content.cta?.subtitle}
          buttonText={content.cta?.button || settings.ctas?.primaryLabel}
        />

        <ContactSection />
      </main>
      <Footer settings={settings} />
    </>
  );
}
