'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { token } = await api.admin.login(username, password);
      localStorage.setItem('token', token);
      router.push('/admin/dashboard');
    } catch {
      setError('Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-voragine-bg px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-voragine-black mb-2">
            Vorágine
          </h1>
          <p className="text-voragine-gray text-sm">
            Panel de administración
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-voragine-bg flex items-center justify-center">
              <Lock className="w-6 h-6 text-voragine-gray" />
            </div>
          </div>
          
          <div>
            <label htmlFor="username" className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-voragine-black transition-colors outline-none"
              placeholder="admin"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-voragine-black transition-colors outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
