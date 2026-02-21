'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Settings {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  social: {
    instagram: string;
    facebook: string;
    pinterest: string;
  };
}

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    tagline: '',
    email: '',
    phone: '',
    address: '',
    social: {
      instagram: '',
      facebook: '',
      pinterest: '',
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      const data = await api.settings.get();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);
    
    try {
      await api.settings.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
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
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-voragine-black mb-2">
          Configuración
        </h1>
        <p className="text-voragine-gray">
          Ajustes generales del sitio
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 space-y-8">
        <div>
          <h2 className="font-serif text-lg text-voragine-black mb-6 pb-2 border-b border-gray-100">
            Información general
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                Nombre del sitio
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                Eslogan
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="font-serif text-lg text-voragine-black mb-6 pb-2 border-b border-gray-100">
            Contacto
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                Dirección
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="font-serif text-lg text-voragine-black mb-6 pb-2 border-b border-gray-100">
            Redes sociales
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={settings.social.instagram}
                onChange={(e) => setSettings({
                  ...settings,
                  social: { ...settings.social, instagram: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
                placeholder="https://instagram.com/tu-cuenta"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={settings.social.facebook}
                onChange={(e) => setSettings({
                  ...settings,
                  social: { ...settings.social, facebook: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
                placeholder="https://facebook.com/tu-pagina"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                Pinterest
              </label>
              <input
                type="url"
                value={settings.social.pinterest}
                onChange={(e) => setSettings({
                  ...settings,
                  social: { ...settings.social, pinterest: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-200 focus:border-voragine-black outline-none"
                placeholder="https://pinterest.com/tu-cuenta"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar cambios
              </>
            )}
          </button>
          
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-green-600 text-sm"
            >
              ✓ Cambios guardados
            </motion.span>
          )}
        </div>
      </form>
    </div>
  );
}
