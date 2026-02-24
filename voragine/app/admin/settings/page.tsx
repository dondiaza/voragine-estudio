'use client';

import { useEffect, useState } from 'react';
import { Download, Loader2, Save } from 'lucide-react';
import { api } from '@/lib/api';

type Settings = {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  social: {
    instagram: string;
    facebook: string;
    x: string;
    tiktok: string;
    pinterest: string;
  };
  branding: {
    logo: string;
    favicon: string;
  };
  ctas: {
    primaryLabel: string;
    primaryUrl: string;
    secondaryLabel: string;
    secondaryUrl: string;
  };
  seo: {
    defaultTitle: string;
    titleSuffix: string;
    defaultDescription: string;
    defaultOgImage: string;
    twitterHandle: string;
    locale: string;
    siteUrl: string;
  };
  business: {
    legalName: string;
    city: string;
    country: string;
    openingHours: string[];
  };
};

const initialSettings: Settings = {
  siteName: '',
  tagline: '',
  email: '',
  phone: '',
  address: '',
  social: {
    instagram: '',
    facebook: '',
    x: '',
    tiktok: '',
    pinterest: ''
  },
  branding: {
    logo: '',
    favicon: ''
  },
  ctas: {
    primaryLabel: '',
    primaryUrl: '/contacto',
    secondaryLabel: '',
    secondaryUrl: '/portfolio'
  },
  seo: {
    defaultTitle: '',
    titleSuffix: '',
    defaultDescription: '',
    defaultOgImage: '',
    twitterHandle: '',
    locale: 'es_ES',
    siteUrl: ''
  },
  business: {
    legalName: '',
    city: '',
    country: '',
    openingHours: []
  }
};

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openingHours, setOpeningHours] = useState('');

  const load = async () => {
    try {
      const data = await api.settings.get() as Settings;
      setSettings({
        ...initialSettings,
        ...data,
        social: { ...initialSettings.social, ...(data.social || {}) },
        branding: { ...initialSettings.branding, ...(data.branding || {}) },
        ctas: { ...initialSettings.ctas, ...(data.ctas || {}) },
        seo: { ...initialSettings.seo, ...(data.seo || {}) },
        business: {
          ...initialSettings.business,
          ...(data.business || {}),
          openingHours: data.business?.openingHours || []
        }
      });
      setOpeningHours((data.business?.openingHours || []).join('\n'));
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.settings.update({
        ...settings,
        business: {
          ...settings.business,
          openingHours: openingHours
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const exportBackup = async () => {
    try {
      const data = await api.export.cms();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voragine-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('No se pudo exportar backup');
    }
  };

  if (loading) {
    return <div className="flex h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-voragine-black">Configuración global</h1>
          <p className="text-sm text-voragine-gray">Contacto, SEO, branding y CTAs</p>
        </div>
        <button type="button" className="btn-secondary flex items-center gap-2" onClick={exportBackup}>
          <Download size={16} />
          Exportar backup CMS
        </button>
      </div>

      <form onSubmit={save} className="grid gap-8 rounded border border-black/10 bg-white p-6">
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-voragine-black">General</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm text-voragine-gray">
              Nombre del sitio
              <input value={settings.siteName} onChange={(event) => setSettings((prev) => ({ ...prev, siteName: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              Eslogan
              <input value={settings.tagline} onChange={(event) => setSettings((prev) => ({ ...prev, tagline: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-voragine-black">Contacto</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-1 text-sm text-voragine-gray">
              Email
              <input type="email" value={settings.email} onChange={(event) => setSettings((prev) => ({ ...prev, email: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              Teléfono
              <input value={settings.phone} onChange={(event) => setSettings((prev) => ({ ...prev, phone: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              Dirección
              <input value={settings.address} onChange={(event) => setSettings((prev) => ({ ...prev, address: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-voragine-black">Social y branding</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm text-voragine-gray">
              Instagram
              <input value={settings.social.instagram} onChange={(event) => setSettings((prev) => ({ ...prev, social: { ...prev.social, instagram: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              Facebook
              <input value={settings.social.facebook} onChange={(event) => setSettings((prev) => ({ ...prev, social: { ...prev.social, facebook: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              X / Twitter
              <input value={settings.social.x} onChange={(event) => setSettings((prev) => ({ ...prev, social: { ...prev.social, x: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              Tiktok
              <input value={settings.social.tiktok} onChange={(event) => setSettings((prev) => ({ ...prev, social: { ...prev.social, tiktok: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              Logo URL
              <input value={settings.branding.logo} onChange={(event) => setSettings((prev) => ({ ...prev, branding: { ...prev.branding, logo: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              Favicon URL
              <input value={settings.branding.favicon} onChange={(event) => setSettings((prev) => ({ ...prev, branding: { ...prev.branding, favicon: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-voragine-black">CTAs globales</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm text-voragine-gray">
              CTA primario label
              <input value={settings.ctas.primaryLabel} onChange={(event) => setSettings((prev) => ({ ...prev, ctas: { ...prev.ctas, primaryLabel: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              CTA primario URL
              <input value={settings.ctas.primaryUrl} onChange={(event) => setSettings((prev) => ({ ...prev, ctas: { ...prev.ctas, primaryUrl: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              CTA secundario label
              <input value={settings.ctas.secondaryLabel} onChange={(event) => setSettings((prev) => ({ ...prev, ctas: { ...prev.ctas, secondaryLabel: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              CTA secundario URL
              <input value={settings.ctas.secondaryUrl} onChange={(event) => setSettings((prev) => ({ ...prev, ctas: { ...prev.ctas, secondaryUrl: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-voragine-black">SEO global</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm text-voragine-gray">
              Título por defecto
              <input value={settings.seo.defaultTitle} onChange={(event) => setSettings((prev) => ({ ...prev, seo: { ...prev.seo, defaultTitle: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              Sufijo título
              <input value={settings.seo.titleSuffix} onChange={(event) => setSettings((prev) => ({ ...prev, seo: { ...prev.seo, titleSuffix: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray md:col-span-2">
              Descripción por defecto
              <textarea rows={2} value={settings.seo.defaultDescription} onChange={(event) => setSettings((prev) => ({ ...prev, seo: { ...prev.seo, defaultDescription: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              OG image por defecto
              <input value={settings.seo.defaultOgImage} onChange={(event) => setSettings((prev) => ({ ...prev, seo: { ...prev.seo, defaultOgImage: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              Site URL (canonical)
              <input value={settings.seo.siteUrl} onChange={(event) => setSettings((prev) => ({ ...prev, seo: { ...prev.seo, siteUrl: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl text-voragine-black">Business schema</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm text-voragine-gray">
              Razón social
              <input value={settings.business.legalName} onChange={(event) => setSettings((prev) => ({ ...prev, business: { ...prev.business, legalName: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              Ciudad
              <input value={settings.business.city} onChange={(event) => setSettings((prev) => ({ ...prev, business: { ...prev.business, city: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray">
              País
              <input value={settings.business.country} onChange={(event) => setSettings((prev) => ({ ...prev, business: { ...prev.business, country: event.target.value } }))} className="rounded border border-black/15 px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm text-voragine-gray md:col-span-2">
              Horarios (uno por línea)
              <textarea rows={3} value={openingHours} onChange={(event) => setOpeningHours(event.target.value)} className="rounded border border-black/15 px-3 py-2" />
            </label>
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
            <Save size={16} />
            {saving ? 'Guardando...' : 'Guardar configuración'}
          </button>
          {saved && <span className="text-sm text-green-600">Cambios guardados</span>}
        </div>
      </form>
    </div>
  );
}
