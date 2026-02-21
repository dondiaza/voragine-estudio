import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vorágine Estudio | Fotografía Artística',
  description: 'Capturamos instantes que no vuelven. Estudio de fotografía especializado en bodas, eventos, retratos personales y proyectos creativos.',
  keywords: ['fotografía', 'bodas', 'eventos', 'retratos', 'estudio fotográfico', 'Madrid'],
  authors: [{ name: 'Vorágine Estudio' }],
  openGraph: {
    title: 'Vorágine Estudio | Fotografía Artística',
    description: 'Capturamos instantes que no vuelven. Estudio de fotografía especializado en bodas, eventos y retratos.',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vorágine Estudio | Fotografía Artística',
    description: 'Capturamos instantes que no vuelven.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-voragine-bg text-voragine-black">
        {children}
      </body>
    </html>
  );
}
