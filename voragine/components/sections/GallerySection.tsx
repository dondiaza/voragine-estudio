'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '@/hooks/useHelpers';

interface GalleryImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface Gallery {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category: { name: string; slug: string };
  images: GalleryImage[];
  coverImage?: string;
  featured?: boolean;
}

interface GallerySectionProps {
  galleries?: Gallery[];
  categories?: { name: string; slug: string }[];
}

export default function GallerySection({ 
  galleries = [],
  categories = []
}: GallerySectionProps) {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  
  const allCategories = [{ name: 'Todos', slug: 'all' }, ...categories];
  
  const filteredGalleries = activeCategory === 'all'
    ? galleries
    : galleries.filter(g => g.category?.slug === activeCategory);
  
  const openLightbox = (gallery: Gallery, imageIndex: number = 0) => {
    setCurrentGallery(gallery);
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentGallery(null);
    document.body.style.overflow = '';
  };
  
  const nextImage = () => {
    if (currentGallery) {
      setCurrentImageIndex((prev) => 
        prev === currentGallery.images.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  const prevImage = () => {
    if (currentGallery) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? currentGallery.images.length - 1 : prev - 1
      );
    }
  };
  
  return (
    <section id="galerias" className="section-padding-lg bg-white" ref={ref}>
      <div className="container-fluid">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="label text-voragine-accent mb-4"
          >
            Portafolio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-lg text-voragine-black"
          >
            Galerías
          </motion.h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {allCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveCategory(category.slug)}
              className={`px-6 py-2 text-sm uppercase tracking-widest transition-all duration-300 ${
                activeCategory === category.slug
                  ? 'bg-voragine-black text-white'
                  : 'bg-transparent text-voragine-gray border border-gray-300 hover:border-voragine-black'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>
        
        {filteredGalleries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-voragine-gray">
              No hay galerías disponibles en esta categoría.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredGalleries.map((gallery, index) => (
                <motion.div
                  key={gallery._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(gallery)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    <img
                      src={gallery.coverImage || gallery.images[0]?.url || '/images/placeholder.jpg'}
                      alt={gallery.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="label text-white/70 mb-2 block">
                        {gallery.category?.name}
                      </span>
                      <h3 className="font-serif text-2xl text-white">
                        {gallery.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      
      <AnimatePresence>
        {lightboxOpen && currentGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 text-white/70 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X size={32} />
            </button>
            
            {currentGallery.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-6 z-10 text-white/70 hover:text-white transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={48} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-6 z-10 text-white/70 hover:text-white transition-colors"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={48} />
                </button>
              </>
            )}
            
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={currentGallery.images[currentImageIndex]?.url}
              alt={currentGallery.images[currentImageIndex]?.alt || currentGallery.title}
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <h4 className="font-serif text-xl text-white mb-1">
                {currentGallery.title}
              </h4>
              <p className="text-white/50 text-sm">
                {currentImageIndex + 1} / {currentGallery.images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
