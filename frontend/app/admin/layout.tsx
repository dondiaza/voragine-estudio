'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Images, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { api } from '@/lib/api';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/galleries', label: 'Galerías', icon: Images },
  { href: '/admin/messages', label: 'Mensajes', icon: MessageSquare },
  { href: '/admin/settings', label: 'Configuración', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }
      
      try {
        await api.admin.getMe();
        setIsLoading(false);
      } catch {
        localStorage.removeItem('token');
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin/login');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-voragine-bg">
        <div className="animate-spin w-8 h-8 border-2 border-voragine-black border-t-transparent rounded-full" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-voragine-bg">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-100">
          <Link href="/admin/dashboard" className="block">
            <h1 className="font-serif text-2xl text-voragine-black">
              Vorágine
            </h1>
            <p className="text-xs text-voragine-gray mt-1">Panel de administración</p>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-voragine-black text-white'
                    : 'text-voragine-gray hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-voragine-gray hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <main className="lg:ml-64 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
