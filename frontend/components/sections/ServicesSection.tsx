'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useHelpers';

interface Service {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
  services?: Service[];
}

const defaultServices: Service[] = [
  {
    id: 'bodas',
    title: 'Bodas',
    description: 'Documentamos el día más importante de vuestra vida con sensibilidad y arte.',
  },
  {
    id: 'eventos',
    title: 'Eventos',
    description: 'Fiestas, celebraciones y encuentros que merecen ser recordados.',
  },
  {
    id: 'personal',
    title: 'Personal',
    description: 'Retratos que revelan tu esencia y personalidad única.',
  },
  {
    id: 'creativos',
    title: 'Proyectos Creativos',
    description: 'Colaboraciones artísticas y proyectos visuales especiales.',
  },
];

export default function ServicesSection({
  title = 'Qué hacemos',
  subtitle = 'Especialistas en capturar la esencia de cada momento',
  services = defaultServices,
}: ServicesSectionProps) {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  
  return (
    <section id="que-hacemos" className="section-padding-lg bg-voragine-bg" ref={ref}>
      <div className="container-fluid">
        <div className="text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="label text-voragine-accent mb-4"
          >
            Servicios
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-lg text-voragine-black"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="body-lg text-voragine-gray mt-4 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              className="group"
            >
              <Link href={`#galerias?category=${service.id}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 mb-6">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="font-serif text-6xl text-white/30">
                        {service.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>
                
                <h3 className="font-serif text-2xl text-voragine-black mb-2 group-hover:text-voragine-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-voragine-gray text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-voragine-black group-hover:text-voragine-accent transition-colors">
                  Ver más
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
