'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useInView } from '@/hooks/useHelpers';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function CTASection({
  title = 'Cuéntanos qué quieres capturar',
  subtitle = 'Estamos aquí para escuchar tu historia',
  buttonText = 'Escríbenos',
}: CTASectionProps) {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  
  return (
    <section className="relative py-24 md:py-32 bg-voragine-black overflow-hidden" ref={ref}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-voragine-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-voragine-accent rounded-full blur-3xl" />
      </div>
      
      <div className="container-fluid relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-light mb-6"
          >
            {title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg md:text-xl text-white/60 mb-10"
          >
            {subtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              href="#contacto"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-voragine-black text-sm font-medium uppercase tracking-widest hover:bg-voragine-accent hover:text-white transition-all duration-300"
            >
              {buttonText}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
