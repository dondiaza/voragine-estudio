'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useHelpers';

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface ProcessSectionProps {
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[];
}

const defaultSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Nos cuentas tu historia',
    description: 'Escuchamos tus ideas, inquietudes y lo que quieres transmitir.',
  },
  {
    number: '02',
    title: 'Diseñamos la sesión',
    description: 'Planificamos cada detalle para que todo fluya naturalmente.',
  },
  {
    number: '03',
    title: 'Capturamos el momento',
    description: 'Trabajamos con sensibilidad, buscando la autenticidad.',
  },
  {
    number: '04',
    title: 'Entregamos recuerdos',
    description: 'Cuidamos cada imagen y te entregamos obras de arte.',
  },
];

export default function ProcessSection({
  title = 'Nuestro proceso',
  subtitle = 'Un viaje creativo juntos',
  steps = defaultSteps,
}: ProcessSectionProps) {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  
  return (
    <section className="section-padding-lg bg-white overflow-hidden" ref={ref}>
      <div className="container-fluid">
        <div className="text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="label text-voragine-accent mb-4"
          >
            Cómo trabajamos
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
            className="body-lg text-voragine-gray mt-4"
          >
            {subtitle}
          </motion.p>
        </div>
        
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gray-200 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * (index + 1) }}
                className="relative text-center lg:px-8"
              >
                <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-voragine-bg border-2 border-voragine-accent mb-6">
                  <span className="font-serif text-2xl text-voragine-accent">
                    {step.number}
                  </span>
                </div>
                
                <h3 className="font-serif text-xl text-voragine-black mb-3">
                  {step.title}
                </h3>
                <p className="text-voragine-gray text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
