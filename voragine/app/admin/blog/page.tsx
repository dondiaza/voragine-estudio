'use client';

import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  published?: boolean;
  active?: boolean;
  publishedAt?: string;
};

const initialForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'noticias',
  tags: '',
  coverImage: '',
  published: true,
  active: true,
  publishedAt: new Date().toISOString().slice(0, 10)
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    try {
      const data = await api.posts.getAll(true, true) as Post[];
      setPosts(data);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar posts');
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

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'noticias',
      tags: (post.tags || []).join(', '),
      coverImage: post.coverImage || '',
      published: post.published !== false,
      active: post.active !== false,
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    });
    setShowModal(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
        coverImage: form.coverImage,
        published: form.published,
        active: form.active,
        publishedAt: form.publishedAt ? new Date(form.publishedAt) : new Date()
      };

      if (editing) {
        await api.posts.update(editing._id, payload);
      } else {
        await api.posts.create(payload);
      }

      setShowModal(false);
      await load();
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el post');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar post?')) return;
    try {
      await api.posts.delete(id);
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
          <h1 className="font-serif text-3xl text-voragine-black">Blog</h1>
          <p className="text-sm text-voragine-gray">Noticias y artículos</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openCreate}>
          <Plus size={16} /> Nuevo post
        </button>
      </div>

      <div className="overflow-hidden rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-voragine-bg">
            <tr>
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <p className="font-medium text-voragine-black">{post.title}</p>
                  <p className="text-xs text-voragine-gray">{post.slug}</p>
                </td>
                <td className="px-4 py-3 text-voragine-gray">{post.category}</td>
                <td className="px-4 py-3 text-voragine-gray">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-ES') : '-'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {post.published ? 'Publicado' : 'Borrador'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="rounded p-2 hover:bg-black/5" onClick={() => openEdit(post)}>
                      <Pencil size={15} />
                    </button>
                    <button className="rounded p-2 text-red-600 hover:bg-red-50" onClick={() => remove(post._id)}>
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
              <h2 className="font-serif text-2xl">{editing ? 'Editar post' : 'Nuevo post'}</h2>
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

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Categoría
                  <input value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                </label>
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Tags (coma)
                  <input value={form.tags} onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                </label>
              </div>

              <label className="grid gap-1 text-sm text-voragine-gray">
                Extracto
                <textarea rows={2} value={form.excerpt} onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
              </label>

              <label className="grid gap-1 text-sm text-voragine-gray">
                Portada (URL)
                <input value={form.coverImage} onChange={(event) => setForm((prev) => ({ ...prev, coverImage: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
              </label>

              <label className="grid gap-1 text-sm text-voragine-gray">
                Contenido
                <textarea rows={10} value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
              </label>

              <div className="grid gap-5 md:grid-cols-3">
                <label className="grid gap-1 text-sm text-voragine-gray">
                  Fecha publicación
                  <input type="date" value={form.publishedAt} onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
                </label>
                <label className="flex items-center gap-2 text-sm text-voragine-gray">
                  <input type="checkbox" checked={form.published} onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))} />
                  Publicado
                </label>
                <label className="flex items-center gap-2 text-sm text-voragine-gray">
                  <input type="checkbox" checked={form.active} onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))} />
                  Activo
                </label>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
