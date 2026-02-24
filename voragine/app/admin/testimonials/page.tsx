'use client';

import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  rating?: number;
  featured?: boolean;
  active?: boolean;
  order?: number;
};

const initialForm = {
  name: '',
  role: '',
  company: '',
  quote: '',
  rating: 5,
  featured: false,
  active: true,
  order: 0
};

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.testimonials.getAll(true) as Testimonial[];
      setItems(data);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar testimonios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.testimonials.update(editingId, form);
      } else {
        await api.testimonials.create(form);
      }
      setForm(initialForm);
      setEditingId(null);
      await load();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el testimonio');
    } finally {
      setSaving(false);
    }
  };

  const edit = (item: Testimonial) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      role: item.role || '',
      company: item.company || '',
      quote: item.quote,
      rating: item.rating || 5,
      featured: Boolean(item.featured),
      active: item.active !== false,
      order: item.order || 0
    });
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar testimonio?')) return;
    try {
      await api.testimonials.delete(id);
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
      <div>
        <h1 className="font-serif text-3xl text-voragine-black">Testimonios</h1>
        <p className="text-sm text-voragine-gray">Clientes y reputación del estudio</p>
      </div>

      <form onSubmit={submit} className="grid gap-4 rounded border border-black/10 bg-white p-5 md:grid-cols-4">
        <label className="grid gap-1 text-sm text-voragine-gray">
          Nombre *
          <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="rounded border border-black/15 px-3 py-2" required />
        </label>
        <label className="grid gap-1 text-sm text-voragine-gray">
          Rol
          <input value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm text-voragine-gray">
          Empresa
          <input value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm text-voragine-gray">
          Rating
          <input type="number" min={1} max={5} value={form.rating} onChange={(event) => setForm((prev) => ({ ...prev, rating: Number(event.target.value) }))} className="rounded border border-black/15 px-3 py-2" />
        </label>

        <label className="grid gap-1 text-sm text-voragine-gray md:col-span-4">
          Cita *
          <textarea rows={3} value={form.quote} onChange={(event) => setForm((prev) => ({ ...prev, quote: event.target.value }))} className="rounded border border-black/15 px-3 py-2" required />
        </label>

        <label className="grid gap-1 text-sm text-voragine-gray">
          Orden
          <input type="number" value={form.order} onChange={(event) => setForm((prev) => ({ ...prev, order: Number(event.target.value) }))} className="rounded border border-black/15 px-3 py-2" />
        </label>
        <label className="flex items-center gap-2 text-sm text-voragine-gray">
          <input type="checkbox" checked={form.featured} onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))} />
          Destacado
        </label>
        <label className="flex items-center gap-2 text-sm text-voragine-gray">
          <input type="checkbox" checked={form.active} onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))} />
          Activo
        </label>

        <div className="md:col-span-4 flex gap-3">
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
            <Plus size={14} />
            {saving ? 'Guardando...' : editingId ? 'Actualizar testimonio' : 'Crear testimonio'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(initialForm); }}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-voragine-bg">
            <tr>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Cita</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <p className="font-medium text-voragine-black">{item.name}</p>
                  <p className="text-xs text-voragine-gray">{[item.role, item.company].filter(Boolean).join(' · ')}</p>
                </td>
                <td className="px-4 py-3 text-voragine-gray">{item.quote}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="rounded p-2 hover:bg-black/5" onClick={() => edit(item)}>
                      <Pencil size={15} />
                    </button>
                    <button className="rounded p-2 text-red-600 hover:bg-red-50" onClick={() => remove(item._id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
