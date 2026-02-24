import type { ReactNode } from 'react';
import MainHeader from '@/components/site/MainHeader';
import MainFooter from '@/components/site/MainFooter';
import type { SiteSettings } from '@/lib/cms';
import { buildOrganizationSchema } from '@/lib/seo';

type SiteFrameProps = {
  settings: SiteSettings;
  children: ReactNode;
};

export default function SiteFrame({ settings, children }: SiteFrameProps) {
  const schema = buildOrganizationSchema(settings);

  return (
    <>
      <MainHeader siteName={settings.siteName || 'Vorágine'} />
      <main>{children}</main>
      <MainFooter settings={settings} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
