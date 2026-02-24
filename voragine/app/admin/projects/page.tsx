'use client';

import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

type Category = {
  _id: string;
  name: string;
};

type Project = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category?: { _id: string; name: string; slug: string };
  tags?: string[];
  images?: { url: string; alt?: string; order?: number; width?: number; height?: number }[];
  coverImage?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
};

const initialForm = {
  title: '',
  slug: '',
  description: '',
  category: '',
  tags: '',
  coverImage: '',
  images: '[\n  {\n    "url": "",\n    "alt": "",\n    "order": 1\n  }\n]',
  featured: false,
  active: true,
  order: 0
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    try {
      const [projectsData, categoriesData] = await Promise.all([
        api.projects.getAll({ includeInactive: true }) as Promise<Project[]>,
        api.categories.getAll(true) as Promise<Category[]>
      ]);
      setProjects(projectsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...initialForm,
      category: categories[0]?._id || ''
    });
    setShowModal(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description || '',
      category: project.category?._id || '',
      tags: (project.tags || []).join(', '),
      coverImage: project.coverImage || '',
      images: JSON.stringify(project.images || [], null, 2),
      featured: Boolean(project.featured),
      active: project.active !== false,
      order: project.order || 0
    });
    setShowModal(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const images = JSON.parse(form.images);
      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        category: form.category,
        tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
        coverImage: form.coverImage,
        images,
        featured: form.featured,
        active: form.active,
        order: form.order
      };

      if (editing) {
        await api.projects.update(editing._id, payload);
      } else {
        await api.projects.create(payload);
      }

      setShowModal(false);
      await load();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar. Revisa el JSON de imágenes.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar proyecto?')) return;
    try {
      await api.projects.delete(id);
      await load();
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar');
    }
  };

  const uploadCover = async (file: File) => {
    setUploadingCover(true);
    try {
      const result = await api.upload.image(file, 'projects') as { url: string };
      setForm((prev) => ({ ...prev, coverImage: result.url }));
    } catch (error) {
      console.error(error);
      alert('No se pudo subir portada');
    } finally {
      setUploadingCover(false);
    }
  };

  const uploadGallery = async (files: FileList) => {
    setUploadingGallery(true);
    try {
      const result = await api.upload.multiple(Array.from(files), 'projects') as { files: { url: string }[] };
      const current = JSON.parse(form.images) as Array<Record<string, unknown>>;
      const next = [
        ...current,
        ...result.files.map((file, index) => ({
          url: file.url,
          alt: '',
          order: current.length + index + 1
        }))
      ];
      setForm((prev) => ({ ...prev, images: JSON.stringify(next, null, 2) }));
    } catch (error) {
      console.error(error);
      alert('No se pudieron subir imágenes');
    } finally {
      setUploadingGallery(false);
    }
  };

  if (loading) {
    return <div className="flex h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-voragine-black">Portfolio</h1>
          <p className="text-sm text-voragine-gray">Proyectos, galerías y casos</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openCreate}>
          <Plus size={16} /> Nuevo proyecto
        </button>
      </div>

      <div className="overflow-hidden rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-voragine-bg">
            <tr>
              <th className="px-4 py-3 text-left">Proyecto</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">Imágenes</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <p className="font-medium text-voragine-black">{project.title}</p>
                  <p className="text-xs text-voragine-gray">{project.slug}</p>
                </td>
                <td className="px-4 py-3 text-voragine-gray">{project.category?.name || '-'}</td>
                <td className="px-4 py-3 text-voragine-gray">{project.images?.length || 0}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs ${project.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {project.active ? 'Activo' : 'Inactivo'}
                  </span>
                  {project.featured && <span className="ml-2 rounded bg-voragine-accent/20 px-2 py-1 text-xs text-voragine-accent">Destacado</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="rounded p-2 hover:bg-black/5" onClick={() => openEdit(project)}>
                      <Pencil size={15} />
                    </button>
                    <button className="rounded p-2 text-red-600 hover:bg-red-50" onClick={() => remove(project._id)}>
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
              <h2 className="font-serif text-2xl">{editing ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
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
                Descripción
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Categoría *
                  <select
                    value={form.category}
                    onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                    className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Cover image
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
                  {uploadingCover && <span className="text-xs text-voragine-gray">Subiendo portada...</span>}
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Tags (coma)
                  <input
                    value={form.tags}
                    onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
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

              <label className="grid gap-1 text-sm text-voragine-gray">
                Imágenes (JSON)
                <textarea
                  rows={10}
                  value={form.images}
                  onChange={(event) => setForm((prev) => ({ ...prev, images: event.target.value }))}
                  className="rounded border border-black/15 px-3 py-2 font-mono text-xs text-voragine-black"
                />
              </label>

              <label className="grid gap-1 text-sm text-voragine-gray">
                Subir galería (múltiples)
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files?.length) uploadGallery(files);
                  }}
                  className="rounded border border-black/15 px-3 py-2 text-voragine-black"
                />
                {uploadingGallery && <span className="text-xs text-voragine-gray">Subiendo galería...</span>}
              </label>

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
                {saving ? 'Guardando...' : 'Guardar proyecto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
