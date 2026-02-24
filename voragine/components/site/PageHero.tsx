import Link from 'next/link';
import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/cms';

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  ctaLabel,
  ctaUrl
}: PageHeroProps) {
  const media = resolveMediaUrl(image);

  return (
    <section className="relative overflow-hidden border-b border-black/10 bg-voragine-bg py-20 md:py-28">
      {media && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={media}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}
      <div className="container-narrow relative z-10 text-center">
        {eyebrow && (
          <p className="label mb-4 text-voragine-accent">{eyebrow}</p>
        )}
        <h1 className="heading-lg text-voragine-black">{title}</h1>
        {subtitle && (
          <p className="body-md mx-auto mt-5 max-w-3xl text-voragine-gray">{subtitle}</p>
        )}
        {ctaLabel && ctaUrl && (
          <div className="mt-8">
            <Link href={ctaUrl} className="btn-primary">
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
