'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  cta?: string;
  heroImage?: string;
}

export default function HeroSection({ 
  title = 'Capturamos instantes que no vuelven',
  subtitle = 'Fotografía artística para momentos únicos',
  cta = 'Contáctanos',
  heroImage
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-voragine-bg" />
      
      {heroImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      )}
      
      {!heroImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-voragine-black via-gray-900 to-voragine-black">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-voragine-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-voragine-accent/10 rounded-full blur-3xl" />
          </div>
        </div>
      )}
      
      <div className="relative z-10 container-fluid text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="label text-white/60 mb-6 tracking-ultra-wide"
        >
          Vorágine Estudio
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-light leading-tight max-w-5xl mx-auto mb-6"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10"
        >
          {subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="#contacto"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-voragine-black text-sm font-medium uppercase tracking-widest hover:bg-voragine-accent hover:text-white transition-all duration-300"
          >
            {cta}
          </Link>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-white/50" size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
}
