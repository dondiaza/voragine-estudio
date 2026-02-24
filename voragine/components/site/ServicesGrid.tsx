import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/lib/cms';
import { resolveMediaUrl } from '@/lib/cms';

type ServicesGridProps = {
  services: Service[];
};

export default function ServicesGrid({ services }: ServicesGridProps) {
  if (!services.length) {
    return (
      <p className="rounded border border-dashed border-black/20 p-8 text-center text-voragine-gray">
        Todavía no hay servicios publicados.
      </p>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-fluid">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const image = resolveMediaUrl(service.coverImage);
            return (
              <article key={service._id} className="overflow-hidden rounded border border-black/10 bg-white">
                <div className="relative aspect-[4/3] bg-black/5">
                  {image ? (
                    <Image
                      src={image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-voragine-gray">Sin imagen</div>
                  )}
                </div>
                <div className="space-y-4 p-5">
                  <h2 className="font-serif text-2xl text-voragine-black">{service.title}</h2>
                  <p className="text-sm leading-relaxed text-voragine-gray">
                    {service.excerpt || service.description}
                  </p>
                  <Link href={service.ctaUrl || '/contacto'} className="btn-secondary w-full">
                    {service.ctaLabel || 'Solicitar información'}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
