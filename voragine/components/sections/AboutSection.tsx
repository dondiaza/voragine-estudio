'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useHelpers';

interface Advantage {
  title: string;
  description: string;
}

interface AboutSectionProps {
  title?: string;
  subtitle?: string;
  advantages?: Advantage[];
}

const defaultAdvantages: Advantage[] = [
  {
    title: 'Mirada artística',
    description: 'Cada imagen es una composición cuidada con sentido estético.',
  },
  {
    title: 'Edición cuidada',
    description: 'Posproducción profesional que realza sin alterar la esencia.',
  },
  {
    title: 'Experiencia',
    description: 'Años de trabajo nos permiten anticipar y capturar cada momento.',
  },
  {
    title: 'Entrega premium',
    description: 'Materiales de alta calidad y presentación impecable.',
  },
  {
    title: 'Cercanía',
    description: 'Trato personalizado porque cada proyecto es único.',
  },
];

export default function AboutSection({
  title = 'Por qué Vorágine',
  subtitle = 'Más que fotografía, creamos experiencias visuales',
  advantages = defaultAdvantages,
}: AboutSectionProps) {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  
  return (
    <section id="por-que-voragine" className="section-padding-lg bg-voragine-bg" ref={ref}>
      <div className="container-fluid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <p className="label text-voragine-accent mb-4">
                Nuestra diferencia
              </p>
              <h2 className="heading-lg text-voragine-black mb-6">
                {title}
              </h2>
              <p className="body-lg text-voragine-gray">
                {subtitle}
              </p>
            </motion.div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {advantages.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="relative pl-6 border-l border-voragine-accent/30"
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-voragine-accent/10" />
                  <h3 className="font-serif text-xl text-voragine-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-voragine-gray text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
