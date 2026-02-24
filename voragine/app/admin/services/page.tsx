'use client';

import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

type Service = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  coverImage?: string;
  tags?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
};

const initialForm = {
  title: '',
  slug: '',
  excerpt: '',
  description: '',
  coverImage: '',
  tags: '',
  ctaLabel: 'Solicitar presupuesto',
  ctaUrl: '/contacto',
  featured: false,
  active: true,
  order: 0
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(initialForm);

  const loadServices = async () => {
    try {
      const data = await api.services.getAll(true) as Service[];
      setServices(data);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setForm({
      title: service.title,
      slug: service.slug,
      excerpt: service.excerpt || '',
      description: service.description || '',
      coverImage: service.coverImage || '',
      tags: (service.tags || []).join(', '),
      ctaLabel: service.ctaLabel || 'Solicitar presupuesto',
      ctaUrl: service.ctaUrl || '/contacto',
      featured: Boolean(service.featured),
      active: service.active !== false,
      order: service.order || 0
    });
    setShowModal(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      if (editing) {
        await api.services.update(editing._id, payload);
      } else {
        await api.services.create(payload);
      }
      setShowModal(false);
      await loadServices();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el servicio');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar servicio?')) return;
    try {
      await api.services.delete(id);
      await loadServices();
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar');
    }
  };

  const uploadCover = async (file: File) => {
    setUploadingCover(true);
    try {
      const result = await api.upload.image(file, 'services') as { url: string };
      setForm((prev) => ({ ...prev, coverImage: result.url }));
    } catch (error) {
      console.error(error);
      alert('No se pudo subir la imagen');
    } finally {
      setUploadingCover(false);
    }
  };

  if (loading) {
    return <div className="flex h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-voragine-black">Servicios</h1>
          <p className="text-sm text-voragine-gray">CRUD completo de servicios</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openCreate}>
          <Plus size={16} /> Nuevo servicio
        </button>
      </div>

      <div className="overflow-hidden rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-voragine-bg">
            <tr>
              <th className="px-4 py-3 text-left">Servicio</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Orden</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <p className="font-medium text-voragine-black">{service.title}</p>
                  <p className="text-xs text-voragine-gray">{service.excerpt}</p>
                </td>
                <td className="px-4 py-3 text-voragine-gray">{service.slug}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs ${service.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {service.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-voragine-gray">{service.order || 0}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="rounded p-2 hover:bg-black/5" onClick={() => openEdit(service)}>
                      <Pencil size={15} />
                    </button>
                    <button className="rounded p-2 text-red-600 hover:bg-red-50" onClick={() => remove(service._id)}>
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
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded bg-white">
            <div className="flex items-center justify-between border-b border-black/10 p-5">
              <h2 className="font-serif text-2xl">{editing ? 'Editar servicio' : 'Nuevo servicio'}</h2>
              <button className="rounded p-2 hover:bg-black/5" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submit} className="grid gap-5 p-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Título *
                  <input
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                      slug: event.target.value.toLowerCase().trim().replace(/\s+/g, '-')
                    }))}
                    className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Slug *
                  <input
                    value={form.slug}
                    onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                    className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-1 text-sm text-voragine-gray">
                Extracto
                <input
                  value={form.excerpt}
                  onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                  className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                />
              </label>

              <label className="grid gap-1 text-sm text-voragine-gray">
                Descripción
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Imagen portada (URL)
                  <input
                    value={form.coverImage}
                    onChange={(event) => setForm((prev) => ({ ...prev, coverImage: event.target.value }))}
                    className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                  />
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Subir portada
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) uploadCover(file);
                    }}
                    className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                  />
                  {uploadingCover && <span className="text-xs text-voragine-gray">Subiendo...</span>}
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Tags (coma)
                  <input
                    value={form.tags}
                    onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
                    className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  CTA label
                  <input
                    value={form.ctaLabel}
                    onChange={(event) => setForm((prev) => ({ ...prev, ctaLabel: event.target.value }))}
                    className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                  />
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  CTA URL
                  <input
                    value={form.ctaUrl}
                    onChange={(event) => setForm((prev) => ({ ...prev, ctaUrl: event.target.value }))}
                    className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                  />
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Orden
                  <input
                    type="number"
                    value={form.order}
                    onChange={(event) => setForm((prev) => ({ ...prev, order: Number(event.target.value) }))}
                    className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                  />
                </label>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-voragine-gray">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))}
                  />
                  Destacado
                </label>
                <label className="flex items-center gap-2 text-sm text-voragine-gray">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
                  />
                  Activo
                </label>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
