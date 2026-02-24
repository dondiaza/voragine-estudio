'use client';

import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

type Page = {
  _id: string;
  name: string;
  slug: string;
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    image?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
  modules?: unknown[];
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
    noIndex?: boolean;
  };
  active?: boolean;
};

const initialForm = {
  name: '',
  slug: '',
  heroEyebrow: '',
  heroTitle: '',
  heroSubtitle: '',
  heroImage: '',
  heroCtaLabel: '',
  heroCtaUrl: '',
  modules: '[]',
  seoTitle: '',
  seoDescription: '',
  seoCanonical: '',
  seoOgImage: '',
  seoNoIndex: false,
  active: true
};

export default function PagesAdminPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    try {
      const data = await api.pages.getAll(true) as Page[];
      setPages(data);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar páginas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (page: Page) => {
    setEditing(page);
    setForm({
      name: page.name,
      slug: page.slug,
      heroEyebrow: page.hero?.eyebrow || '',
      heroTitle: page.hero?.title || '',
      heroSubtitle: page.hero?.subtitle || '',
      heroImage: page.hero?.image || '',
      heroCtaLabel: page.hero?.ctaLabel || '',
      heroCtaUrl: page.hero?.ctaUrl || '',
      modules: JSON.stringify(page.modules || [], null, 2),
      seoTitle: page.seo?.title || '',
      seoDescription: page.seo?.description || '',
      seoCanonical: page.seo?.canonical || '',
      seoOgImage: page.seo?.ogImage || '',
      seoNoIndex: Boolean(page.seo?.noIndex),
      active: page.active !== false
    });
    setShowModal(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        hero: {
          eyebrow: form.heroEyebrow,
          title: form.heroTitle,
          subtitle: form.heroSubtitle,
          image: form.heroImage,
          ctaLabel: form.heroCtaLabel,
          ctaUrl: form.heroCtaUrl
        },
        modules: JSON.parse(form.modules),
        seo: {
          title: form.seoTitle,
          description: form.seoDescription,
          canonical: form.seoCanonical,
          ogImage: form.seoOgImage,
          noIndex: form.seoNoIndex
        },
        active: form.active
      };

      if (editing) {
        await api.pages.update(editing._id, payload);
      } else {
        await api.pages.create(payload);
      }

      setShowModal(false);
      await load();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar. Revisa JSON de módulos.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar página?')) return;
    try {
      await api.pages.delete(id);
      await load();
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar');
    }
  };

  if (loading) {
    return <div className="flex h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-voragine-black">Páginas</h1>
          <p className="text-sm text-voragine-gray">Contenido modular y SEO por página</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openCreate}>
          <Plus size={16} /> Nueva página
        </button>
      </div>

      <div className="overflow-hidden rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-voragine-bg">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Módulos</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page._id} className="border-t border-black/5">
                <td className="px-4 py-3 text-voragine-black">{page.name}</td>
                <td className="px-4 py-3 text-voragine-gray">{page.slug}</td>
                <td className="px-4 py-3 text-voragine-gray">{page.modules?.length || 0}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs ${page.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {page.active ? 'Publicada' : 'Borrador'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="rounded p-2 hover:bg-black/5" onClick={() => openEdit(page)}>
                      <Pencil size={15} />
                    </button>
                    <button className="rounded p-2 text-red-600 hover:bg-red-50" onClick={() => remove(page._id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded bg-white">
            <div className="flex items-center justify-between border-b border-black/10 p-5">
              <h2 className="font-serif text-2xl">{editing ? 'Editar página' : 'Nueva página'}</h2>
              <button className="rounded p-2 hover:bg-black/5" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submit} className="grid gap-5 p-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Nombre *
                  <input
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                      slug: event.target.value.toLowerCase().trim().replace(/\s+/g, '-')
                    }))}
                    className="rounded border border-black/15 px-3 py-2"
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Slug *
                  <input
                    value={form.slug}
                    onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                    className="rounded border border-black/15 px-3 py-2"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Hero eyebrow
                  <input value={form.heroEyebrow} onChange={(event) => setForm((prev) => ({ ...prev, heroEyebrow: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Hero título
                  <input value={form.heroTitle} onChange={(event) => setForm((prev) => ({ ...prev, heroTitle: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Hero imagen
                  <input value={form.heroImage} onChange={(event) => setForm((prev) => ({ ...prev, heroImage: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Hero subtítulo
                  <textarea rows={2} value={form.heroSubtitle} onChange={(event) => setForm((prev) => ({ ...prev, heroSubtitle: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                </label>
                <div className="grid gap-5">
                  <label className="grid gap-1 text-sm text-voragine-gray">
                    Hero CTA label
                    <input value={form.heroCtaLabel} onChange={(event) => setForm((prev) => ({ ...prev, heroCtaLabel: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                  </label>
                  <label className="grid gap-1 text-sm text-voragine-gray">
                    Hero CTA URL
                    <input value={form.heroCtaUrl} onChange={(event) => setForm((prev) => ({ ...prev, heroCtaUrl: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                  </label>
                </div>
              </div>

              <label className="grid gap-1 text-sm text-voragine-gray">
                Módulos (JSON)
                <textarea rows={8} value={form.modules} onChange={(event) => setForm((prev) => ({ ...prev, modules: event.target.value }))} className="rounded border border-black/15 px-3 py-2 font-mono text-xs" />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  SEO title
                  <input value={form.seoTitle} onChange={(event) => setForm((prev) => ({ ...prev, seoTitle: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  SEO canonical
                  <input value={form.seoCanonical} onChange={(event) => setForm((prev) => ({ ...prev, seoCanonical: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                </label>
              </div>

              <label className="grid gap-1 text-sm text-voragine-gray">
                SEO description
                <textarea rows={2} value={form.seoDescription} onChange={(event) => setForm((prev) => ({ ...prev, seoDescription: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
              </label>

              <label className="grid gap-1 text-sm text-voragine-gray">
                SEO ogImage
                <input value={form.seoOgImage} onChange={(event) => setForm((prev) => ({ ...prev, seoOgImage: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
              </label>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-voragine-gray">
                  <input type="checkbox" checked={form.seoNoIndex} onChange={(event) => setForm((prev) => ({ ...prev, seoNoIndex: event.target.checked }))} />
                  No index
                </label>
                <label className="flex items-center gap-2 text-sm text-voragine-gray">
                  <input type="checkbox" checked={form.active} onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))} />
                  Publicada
                </label>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar página'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
