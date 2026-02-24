import Link from 'next/link';
import type { SiteSettings } from '@/lib/cms';

type MainFooterProps = {
  settings: SiteSettings;
};

const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/sobre-nosotros', label: 'Sobre nosotros' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/blog', label: 'Blog' }
];

export default function MainFooter({ settings }: MainFooterProps) {
  const year = new Date().getFullYear();
  const social = Object.entries(settings.social || {}).filter(([, value]) => Boolean(value));

  return (
    <footer className="mt-20 bg-voragine-black py-14 text-white">
      <div className="container-fluid grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-3xl">{settings.siteName || 'Vorágine Estudio'}</h3>
          <p className="mt-3 max-w-sm text-sm text-white/70">{settings.tagline}</p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-white/60">Navegación</h4>
          <ul className="mt-4 grid gap-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/80 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-white/60">Contacto</h4>
          <div className="mt-4 grid gap-2 text-sm text-white/80">
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
            {settings.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}
            {settings.address && <p>{settings.address}</p>}
          </div>
          {social.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-wide text-white/70">
              {social.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="container-fluid mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
        © {year} {settings.siteName || 'Vorágine Estudio'}.
      </div>
    </footer>
  );
}
