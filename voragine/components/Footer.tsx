'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Mail } from 'lucide-react';

const footerLinks = [
  { href: '#que-hacemos', label: 'Qué hacemos' },
  { href: '#galerias', label: 'Galerías' },
  { href: '#por-que-voragine', label: 'Por qué Vorágine' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-voragine-black text-white py-16 md:py-24">
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-serif text-3xl mb-4">Vorágine Estudio</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Capturamos instantes que no vuelven. Fotografía artística 
                para momentos únicos que merecen ser recordados.
              </p>
            </motion.div>
          </div>
          
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="label text-white/40 mb-6">Navegación</h4>
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="label text-white/40 mb-6">Contacto</h4>
              <div className="space-y-3">
                <a
                  href="mailto:info@voragineestudio.com"
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm"
                >
                  <Mail size={16} />
                  info@voragineestudio.com
                </a>
                <div className="flex items-center gap-4 pt-4">
                  <a
                    href="https://instagram.com/voragineestudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://facebook.com/voragineestudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-white/40 text-xs">
            © {currentYear} Vorágine Estudio. Todos los derechos reservados.
          </p>
          <p className="text-white/30 text-xs">
            Diseño y desarrollo con sensibilidad artística
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
