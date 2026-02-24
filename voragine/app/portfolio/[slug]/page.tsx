import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import SiteFrame from '@/components/site/SiteFrame';
import { getProjectBySlug, getSettings, resolveMediaUrl, toCanonicalUrl } from '@/lib/cms';

type ProjectDetailPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const [settings, project] = await Promise.all([
    getSettings(),
    getProjectBySlug(params.slug)
  ]);

  if (!project) {
    return {
      title: 'Caso no encontrado',
      robots: { index: false, follow: false }
    };
  }

  const title = project.seo?.title || project.title;
  const description = project.seo?.description || project.description || settings.seo?.defaultDescription || '';
  const canonical = toCanonicalUrl(project.seo?.canonical || `/portfolio/${project.slug}`, settings);
  const ogImage = resolveMediaUrl(project.seo?.ogImage || project.coverImage || project.images[0]?.url);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined
    }
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [settings, project] = await Promise.all([
    getSettings(),
    getProjectBySlug(params.slug)
  ]);

  if (!project) {
    notFound();
  }

  return (
    <SiteFrame settings={settings}>
      <section className="section-padding">
        <div className="container-narrow">
          <p className="label text-voragine-accent">{project.category?.name || 'Caso'}</p>
          <h1 className="heading-lg mt-3 text-voragine-black">{project.title}</h1>
          {project.description && <p className="mt-4 text-voragine-gray">{project.description}</p>}
          {project.tags?.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded bg-black/5 px-3 py-1 text-xs text-voragine-gray">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {project.images.map((image, index) => {
              const src = resolveMediaUrl(image.url);
              return (
                <div key={`${project._id}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded bg-black/5">
                  {src ? (
                    <Image
                      src={src}
                      alt={image.alt || `${project.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-voragine-gray">Sin imagen</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
