import type { Metadata } from 'next';
import type { Page, SeoConfig, SiteSettings } from './cms';
import { resolveMediaUrl, toCanonicalUrl } from './cms';

type BuildMetadataOptions = {
  pagePath: string;
  page?: Pick<Page, 'name' | 'slug' | 'seo'> | null;
  settings?: SiteSettings | null;
  fallbackTitle: string;
  fallbackDescription: string;
};

const normalizeTitle = (title: string, settings?: SiteSettings | null) => {
  const suffix = settings?.seo?.titleSuffix?.trim();
  if (!suffix) return title;
  if (title.includes(suffix)) return title;
  return `${title} | ${suffix}`;
};

const getSeoSource = (page?: Pick<Page, 'seo'> | null): SeoConfig => page?.seo || {};

export const buildPageMetadata = ({
  pagePath,
  page,
  settings,
  fallbackTitle,
  fallbackDescription
}: BuildMetadataOptions): Metadata => {
  const seo = getSeoSource(page);
  const settingsSeo = settings?.seo;

  const rawTitle = seo.title || fallbackTitle || settingsSeo?.defaultTitle || 'Vorágine Estudio';
  const title = normalizeTitle(rawTitle, settings);
  const description = seo.description || fallbackDescription || settingsSeo?.defaultDescription || '';
  const canonical = toCanonicalUrl(seo.canonical || pagePath, settings);
  const ogImage = resolveMediaUrl(seo.ogImage || settingsSeo?.defaultOgImage);
  const noIndex = Boolean(seo.noIndex);

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      siteName: settings?.siteName || 'Vorágine Estudio',
      locale: settingsSeo?.locale || 'es_ES',
      images: ogImage ? [{ url: ogImage }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: settingsSeo?.twitterHandle || undefined
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true }
  };
};

export const buildOrganizationSchema = (settings: SiteSettings) => {
  const siteUrl = settings?.seo?.siteUrl || 'http://localhost:3000';
  const logo = resolveMediaUrl(settings?.branding?.logo) || undefined;
  const sameAs = Object.values(settings?.social || {}).filter(Boolean);
  const legalName = settings?.business?.legalName || settings?.siteName || 'Vorágine Estudio';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': settings?.address ? 'LocalBusiness' : 'Organization',
    name: legalName,
    url: siteUrl,
    email: settings?.email || undefined,
    telephone: settings?.phone || undefined,
    sameAs: sameAs.length ? sameAs : undefined
  };

  if (logo) {
    schema.logo = logo;
  }

  if (settings?.address) {
    schema.address = settings.address;
  }

  if (settings?.business?.openingHours?.length) {
    schema.openingHours = settings.business.openingHours;
  }

  if (
    typeof settings?.business?.latitude === 'number' &&
    typeof settings?.business?.longitude === 'number'
  ) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: settings.business.latitude,
      longitude: settings.business.longitude
    };
  }

  return schema;
};
