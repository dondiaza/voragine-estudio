'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Image, MessageSquare, FolderOpen, TrendingUp, Briefcase, FileText, Newspaper } from 'lucide-react';
import { api } from '@/lib/api';

interface Stats {
  projects: number;
  services: number;
  pages: number;
  posts: number;
  messages: number;
  unreadMessages: number;
  categories: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    services: 0,
    pages: 0,
    posts: 0,
    messages: 0,
    unreadMessages: 0,
    categories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, services, pages, posts, categories, unreadMessages, allMessages] = await Promise.all([
          api.projects.getAll(),
          api.services.getAll(true),
          api.pages.getAll(true),
          api.posts.getAll(true, true),
          api.categories.getAll(),
          api.contact.getAll({ unread: 'true' }),
          api.contact.getAll({ archived: 'true' }),
        ]) as [unknown[], unknown[], unknown[], unknown[], unknown[], unknown[], unknown[]];
        
        setStats({
          projects: projects.length,
          services: services.length,
          pages: pages.length,
          posts: posts.length,
          categories: categories.length,
          messages: allMessages.length,
          unreadMessages: unreadMessages.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const statCards = [
    { label: 'Proyectos', value: stats.projects, icon: Image, href: '/admin/projects', color: 'bg-voragine-accent' },
    { label: 'Servicios', value: stats.services, icon: Briefcase, href: '/admin/services', color: 'bg-voragine-black' },
    { label: 'Páginas', value: stats.pages, icon: FileText, href: '/admin/pages', color: 'bg-slate-700' },
    { label: 'Blog', value: stats.posts, icon: Newspaper, href: '/admin/blog', color: 'bg-indigo-600' },
    { label: 'Categorías', value: stats.categories, icon: FolderOpen, href: '/admin/categories', color: 'bg-zinc-700' },
    { label: 'Mensajes nuevos', value: stats.unreadMessages, icon: MessageSquare, href: '/admin/messages', color: 'bg-green-500' },
  ];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-voragine-black border-t-transparent rounded-full" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-voragine-black mb-2">
          Dashboard
        </h1>
        <p className="text-voragine-gray">
          Bienvenido al panel de administración de Vorágine Estudio
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={stat.href} className="block bg-white p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-voragine-gray text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-serif text-voragine-black">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6"
        >
          <h2 className="font-serif text-xl text-voragine-black mb-4">
            Accesos rápidos
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/projects"
              className="flex items-center justify-between p-4 bg-voragine-bg hover:bg-gray-100 transition-colors"
            >
              <span className="text-voragine-black">Crear nuevo proyecto</span>
              <TrendingUp className="w-5 h-5 text-voragine-gray" />
            </Link>
            <Link
              href="/admin/services"
              className="flex items-center justify-between p-4 bg-voragine-bg hover:bg-gray-100 transition-colors"
            >
              <span className="text-voragine-black">Editar servicios</span>
              <TrendingUp className="w-5 h-5 text-voragine-gray" />
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center justify-between p-4 bg-voragine-bg hover:bg-gray-100 transition-colors"
            >
              <span className="text-voragine-black">Ver mensajes</span>
              <MessageSquare className="w-5 h-5 text-voragine-gray" />
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-4 bg-voragine-bg hover:bg-gray-100 transition-colors"
            >
              <span className="text-voragine-black">Configurar sitio</span>
              <TrendingUp className="w-5 h-5 text-voragine-gray" />
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6"
        >
          <h2 className="font-serif text-xl text-voragine-black mb-4">
            Estado del sistema
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-voragine-gray">API Backend</span>
              <span className="text-green-500 text-sm font-medium">● Online</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-voragine-gray">Base de datos</span>
              <span className="text-green-500 text-sm font-medium">● Conectada</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-voragine-gray">Mensajes totales</span>
              <span className="text-voragine-black text-sm">{stats.messages}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-voragine-gray">Última actualización</span>
              <span className="text-voragine-black text-sm">
                {new Date().toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
