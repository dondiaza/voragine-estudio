'use client';

import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  active?: boolean;
};

const newCategory = {
  name: '',
  slug: '',
  description: '',
  order: 0,
  active: true
};

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(newCategory);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.categories.getAll(true) as Category[];
      setCategories(data);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar categorías');
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
        await api.categories.update(editingId, form);
      } else {
        await api.categories.create(form);
      }
      setForm(newCategory);
      setEditingId(null);
      await load();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar la categoría');
    } finally {
      setSaving(false);
    }
  };

  const edit = (category: Category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      order: category.order || 0,
      active: category.active !== false
    });
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar categoría?')) return;
    try {
      await api.categories.delete(id);
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
        <h1 className="font-serif text-3xl text-voragine-black">Categorías</h1>
        <p className="text-sm text-voragine-gray">Configura categorías del portfolio</p>
      </div>

      <form onSubmit={submit} className="grid gap-4 rounded border border-black/10 bg-white p-5 md:grid-cols-5">
        <label className="grid gap-1 text-sm text-voragine-gray">
          Nombre *
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({
              ...prev,
              name: event.target.value,
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
        <label className="grid gap-1 text-sm text-voragine-gray md:col-span-2">
          Descripción
          <input
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
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

        <label className="flex items-center gap-2 text-sm text-voragine-gray md:col-span-5">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
          />
          Activa
        </label>

        <div className="md:col-span-5 flex gap-3">
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
            <Plus size={14} />
            {saving ? 'Guardando...' : editingId ? 'Actualizar categoría' : 'Crear categoría'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm(newCategory);
              }}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-voragine-bg">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Orden</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-t border-black/5">
                <td className="px-4 py-3 text-voragine-black">{category.name}</td>
                <td className="px-4 py-3 text-voragine-gray">{category.slug}</td>
                <td className="px-4 py-3 text-voragine-gray">{category.order || 0}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs ${category.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {category.active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="rounded p-2 hover:bg-black/5" onClick={() => edit(category)}>
                      <Pencil size={15} />
                    </button>
                    <button className="rounded p-2 text-red-600 hover:bg-red-50" onClick={() => remove(category._id)}>
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
