import Image from 'next/image';
import Link from 'next/link';
import type { PageModule } from '@/lib/cms';
import { resolveMediaUrl } from '@/lib/cms';

type PageModulesProps = {
  modules?: PageModule[];
};

export default function PageModules({ modules = [] }: PageModulesProps) {
  if (!modules.length) return null;

  const ordered = [...modules].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="section-padding bg-white">
      <div className="container-narrow grid gap-10">
        {ordered.map((module, index) => {
          const image = resolveMediaUrl(module.image);
          return (
            <article key={`${module.type}-${index}`} className="grid gap-6 rounded border border-black/10 p-6 md:grid-cols-2 md:p-8">
              <div>
                <p className="label text-voragine-accent">{module.type}</p>
                {module.heading && <h2 className="mt-3 font-serif text-3xl text-voragine-black">{module.heading}</h2>}
                {module.body && <p className="mt-4 whitespace-pre-wrap text-voragine-gray">{module.body}</p>}
                {module.items?.length ? (
                  <ul className="mt-4 grid gap-2 text-sm text-voragine-gray">
                    {module.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="rounded bg-black/5 px-3 py-2">
                        {typeof item === 'string' ? item : JSON.stringify(item)}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {module.ctaLabel && module.ctaUrl && (
                  <div className="mt-6">
                    <Link href={module.ctaUrl} className="btn-secondary">
                      {module.ctaLabel}
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative min-h-48 overflow-hidden rounded bg-black/5">
                {image ? (
                  <Image
                    src={image}
                    alt={module.heading || module.type}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-voragine-gray">
                    Sin imagen
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
