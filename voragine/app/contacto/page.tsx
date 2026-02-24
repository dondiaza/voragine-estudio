import type { Metadata } from 'next';
import SiteFrame from '@/components/site/SiteFrame';
import PageHero from '@/components/site/PageHero';
import PageModules from '@/components/site/PageModules';
import ContactForm from '@/components/site/ContactForm';
import { getPage, getSettings } from '@/lib/cms';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSettings(), getPage('contacto')]);
  return buildPageMetadata({
    pagePath: '/contacto',
    page,
    settings,
    fallbackTitle: 'Contacto',
    fallbackDescription: 'Contáctanos para presupuestos y reservas.'
  });
}

export default async function ContactPage() {
  const [settings, page] = await Promise.all([
    getSettings(),
    getPage('contacto')
  ]);

  return (
    <SiteFrame settings={settings}>
      <PageHero
        eyebrow={page?.hero?.eyebrow || 'Contacto'}
        title={page?.hero?.title || 'Hablemos de tu proyecto'}
        subtitle={page?.hero?.subtitle || 'Respuesta en 24-48h'}
        image={page?.hero?.image}
      />

      <section className="section-padding">
        <div className="container-narrow grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-voragine-accent">Datos de contacto</p>
            <div className="mt-4 grid gap-2 text-voragine-gray">
              {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
              {settings.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
              {settings.address && <p>{settings.address}</p>}
            </div>
          </div>
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <PageModules modules={page?.modules} />
    </SiteFrame>
  );
}
