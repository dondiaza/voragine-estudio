'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { useInView } from '@/hooks/useHelpers';
import { api } from '@/lib/api';

const projectTypes = [
  { value: 'bodas', label: 'Bodas' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'personal', label: 'Personal' },
  { value: 'proyectos-creativos', label: 'Proyectos Creativos' },
  { value: 'otro', label: 'Otro' },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
}

export default function ContactSection() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Introduce un email válido';
    }
    
    if (!formData.projectType) {
      newErrors.projectType = 'Selecciona un tipo de proyecto';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await api.contact.send(formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: '',
      });
    } catch {
      setErrors({ message: 'Error al enviar el mensaje. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  return (
    <section id="contacto" className="section-padding-lg bg-voragine-bg" ref={ref}>
      <div className="container-fluid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <p className="label text-voragine-accent mb-4">
                Contacto
              </p>
              <h2 className="heading-lg text-voragine-black mb-6">
                Hablemos de tu proyecto
              </h2>
              <p className="body-lg text-voragine-gray mb-8">
                Cada proyecto es único. Cuéntanos tus ideas y diseñaremos 
                juntos la sesión perfecta para capturar tus momentos especiales.
              </p>
              
              <div className="space-y-4 text-voragine-gray">
                <p className="flex items-center gap-3">
                  <span className="text-voragine-accent">→</span>
                  Respuesta en 24-48 horas
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-voragine-accent">→</span>
                  Presupuesto personalizado
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-voragine-accent">→</span>
                  Asesoría sin compromiso
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isSubmitted ? (
                <div className="bg-white p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <CheckCircle className="w-16 h-16 text-voragine-accent mx-auto mb-6" />
                  </motion.div>
                  <h3 className="font-serif text-2xl text-voragine-black mb-4">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-voragine-gray">
                    Gracias por contactarnos. Te responderemos lo antes posible.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-sm text-voragine-accent hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-0 py-3 bg-transparent border-b ${
                          errors.name ? 'border-red-400' : 'border-gray-200 focus:border-voragine-black'
                        } transition-colors outline-none`}
                        placeholder="Tu nombre"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-0 py-3 bg-transparent border-b ${
                          errors.email ? 'border-red-400' : 'border-gray-200 focus:border-voragine-black'
                        } transition-colors outline-none`}
                        placeholder="tu@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-voragine-black transition-colors outline-none"
                        placeholder="+34 600 000 000"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="projectType" className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                        Tipo de proyecto *
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className={`w-full px-0 py-3 bg-transparent border-b ${
                          errors.projectType ? 'border-red-400' : 'border-gray-200 focus:border-voragine-black'
                        } transition-colors outline-none appearance-none cursor-pointer`}
                      >
                        <option value="">Selecciona...</option>
                        {projectTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.projectType && (
                        <p className="text-red-400 text-xs mt-1">{errors.projectType}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-xs uppercase tracking-widest text-voragine-gray mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-0 py-3 bg-transparent border-b ${
                        errors.message ? 'border-red-400' : 'border-gray-200 focus:border-voragine-black'
                      } transition-colors outline-none resize-none`}
                      placeholder="Cuéntanos sobre tu proyecto..."
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Enviar mensaje
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
