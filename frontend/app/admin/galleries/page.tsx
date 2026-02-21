'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Gallery {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category: Category;
  images: { url: string; alt?: string }[];
  coverImage?: string;
  featured: boolean;
  active: boolean;
}

export default function GalleriesAdminPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    featured: false,
    active: true,
  });
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [galleriesData, categoriesData] = await Promise.all([
        api.galleries.getAll(),
        api.categories.getAll(),
      ]);
      setGalleries(galleriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const openModal = (gallery?: Gallery) => {
    if (gallery) {
      setEditingGallery(gallery);
      setFormData({
        title: gallery.title,
        slug: gallery.slug,
        description: gallery.description || '',
        category: gallery.category._id,
        featured: gallery.featured,
        active: gallery.active,
      });
    } else {
      setEditingGallery(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        category: categories[0]?._id || '',
        featured: false,
        active: true,
      });
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGallery(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingGallery) {
        await api.galleries.update(editingGallery._id, formData);
      } else {
        await api.galleries.create(formData);
      }
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Error saving gallery:', error);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta galería?')) return;
    
    try {
      await api.galleries.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting gallery:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-voragine-black" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-voragine-black mb-2">
            Galerías
          </h1>
          <p className="text-voragine-gray">
            Gestiona las galerías de fotografías
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Nueva galería
        </button>
      </div>
      
      <div className="bg-white overflow-hidden">
        {galleries.length === 0 ? (
          <div className="p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-voragine-gray">No hay galerías creadas</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-voragine-accent hover:underline"
            >
              Crear la primera galería
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-voragine-bg">
              <tr>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-voragine-gray">
                  Galería
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-voragine-gray">
                  Categoría
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-voragine-gray">
                  Imágenes
                </th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-widest text-voragine-gray">
                  Estado
                </th>
                <th className="text-right px-6 py-4 text-xs uppercase tracking-widest text-voragine-gray">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {galleries.map((gallery) => (
                <tr key={gallery._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-voragine-black">{gallery.title}</p>
                      <p className="text-sm text-voragine-gray">{gallery.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-voragine-gray">
                    {gallery.category?.name}
                  </td>
                  <td className="px-6 py-4 text-voragine-gray">
                    {gallery.images?.length || 0} imágenes
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      gallery.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {gallery.active ? 'Activa' : 'Inactiva'}
                    </span>
                    {gallery.featured && (
                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium rounded bg-voragine-accent/10 text-voragine-accent">
                        Destacada
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(gallery)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} className="text-voragine-gray" />
                      </button>
                      <button
                        onClick={() => handleDelete(gallery._id)}
                        className="p-2 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-serif text-xl text-voragine-black">
                {editingGallery ? 'Editar galería' : 'Nueva galería'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none resize-none"
                />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-voragine-accent"
                  />
                  <span className="text-sm text-voragine-black">Destacada</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 accent-voragine-accent"
                  />
                  <span className="text-sm text-voragine-black">Activa</span>
                </label>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingGallery ? 'Guardar cambios' : 'Crear galería'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
