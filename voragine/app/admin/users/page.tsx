'use client';

import { useEffect, useState } from 'react';
import { Loader2, Pencil, Plus } from 'lucide-react';
import { api } from '@/lib/api';

type AdminUser = {
  _id: string;
  username: string;
  email: string;
  name?: string;
  role: 'admin' | 'editor';
  active: boolean;
};

const initialCreate = {
  username: '',
  email: '',
  name: '',
  role: 'editor' as 'admin' | 'editor',
  password: 'editor12345'
};

const initialEdit = {
  name: '',
  email: '',
  role: 'editor' as 'admin' | 'editor',
  active: true
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState(initialCreate);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(initialEdit);

  const load = async () => {
    try {
      const data = await api.admin.getUsers() as AdminUser[];
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar usuarios. Este módulo requiere rol admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.admin.createUser(createForm);
      setCreateForm(initialCreate);
      await load();
    } catch (error) {
      console.error(error);
      alert('No se pudo crear el usuario');
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = (user: AdminUser) => {
    setEditingId(user._id);
    setEditForm({
      name: user.name || '',
      email: user.email,
      role: user.role,
      active: user.active
    });
  };

  const saveEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingId) return;
    setSaving(true);
    try {
      await api.admin.updateUser(editingId, editForm);
      setEditingId(null);
      await load();
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar el usuario');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-48 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-voragine-black">Usuarios</h1>
        <p className="text-sm text-voragine-gray">Roles y permisos del CMS</p>
      </div>

      <form onSubmit={createUser} className="grid gap-4 rounded border border-black/10 bg-white p-5 md:grid-cols-5">
        <label className="grid gap-1 text-sm text-voragine-gray">
          Username *
          <input value={createForm.username} onChange={(event) => setCreateForm((prev) => ({ ...prev, username: event.target.value }))} className="rounded border border-black/15 px-3 py-2" required />
        </label>
        <label className="grid gap-1 text-sm text-voragine-gray">
          Email *
          <input type="email" value={createForm.email} onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))} className="rounded border border-black/15 px-3 py-2" required />
        </label>
        <label className="grid gap-1 text-sm text-voragine-gray">
          Nombre
          <input value={createForm.name} onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm text-voragine-gray">
          Rol
          <select value={createForm.role} onChange={(event) => setCreateForm((prev) => ({ ...prev, role: event.target.value as 'admin' | 'editor' }))} className="rounded border border-black/15 px-3 py-2">
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm text-voragine-gray">
          Password *
          <input type="text" value={createForm.password} onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))} className="rounded border border-black/15 px-3 py-2" required />
        </label>
        <div className="md:col-span-5">
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
            <Plus size={14} />
            {saving ? 'Creando...' : 'Crear usuario'}
          </button>
        </div>
      </form>

      {editingId && (
        <form onSubmit={saveEdit} className="grid gap-4 rounded border border-black/10 bg-white p-5 md:grid-cols-4">
          <label className="grid gap-1 text-sm text-voragine-gray">
            Nombre
            <input value={editForm.name} onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm text-voragine-gray">
            Email
            <input type="email" value={editForm.email} onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))} className="rounded border border-black/15 px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm text-voragine-gray">
            Rol
            <select value={editForm.role} onChange={(event) => setEditForm((prev) => ({ ...prev, role: event.target.value as 'admin' | 'editor' }))} className="rounded border border-black/15 px-3 py-2">
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-voragine-gray">
            <input type="checkbox" checked={editForm.active} onChange={(event) => setEditForm((prev) => ({ ...prev, active: event.target.checked }))} />
            Activo
          </label>
          <div className="md:col-span-4 flex gap-3">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setEditingId(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-voragine-bg">
            <tr>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <p className="font-medium text-voragine-black">{user.username}</p>
                  <p className="text-xs text-voragine-gray">{user.name}</p>
                </td>
                <td className="px-4 py-3 text-voragine-gray">{user.email}</td>
                <td className="px-4 py-3 text-voragine-gray">{user.role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs ${user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <button className="rounded p-2 hover:bg-black/5" onClick={() => beginEdit(user)}>
                      <Pencil size={15} />
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
