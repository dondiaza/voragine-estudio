import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSettings } from '@/lib/cms';

const fallbackSiteUrl = 'http://localhost:3000';

const getMetadataBase = (siteUrl?: string) => {
  try {
    return new URL(siteUrl || fallbackSiteUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = settings?.seo?.siteUrl || fallbackSiteUrl;
  const metadataBase = getMetadataBase(siteUrl);
  const title = settings?.seo?.defaultTitle || 'Vorágine Estudio | Fotografía profesional';
  const description = settings?.seo?.defaultDescription || 'Estudio de fotografía profesional.';
  const ogImage = settings?.seo?.defaultOgImage;

  return {
    metadataBase,
    title: {
      default: title,
      template: `%s | ${settings?.seo?.titleSuffix || settings?.siteName || 'Vorágine Estudio'}`
    },
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: settings?.seo?.locale || 'es_ES',
      url: metadataBase.toString(),
      siteName: settings?.siteName || 'Vorágine Estudio',
      images: ogImage ? [{ url: ogImage }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: settings?.seo?.twitterHandle || undefined
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111111'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-voragine-bg text-voragine-black">{children}</body>
    </html>
  );
}
