import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import GallerySection from '@/components/sections/GallerySection';
import AboutSection from '@/components/sections/AboutSection';
import ProcessSection from '@/components/sections/ProcessSection';
import CTASection from '@/components/sections/CTASection';
import ContactSection from '@/components/sections/ContactSection';

async function getData() {
  try {
    const [contentRes, galleriesRes, categoriesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/content`, {
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/galleries`, {
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`, {
        cache: 'no-store',
      }),
    ]);
    
    const content = contentRes.ok ? await contentRes.json() : {};
    const galleries = galleriesRes.ok ? await galleriesRes.json() : [];
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    
    return { content, galleries, categories };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { content: {}, galleries: [], categories: [] };
  }
}

export default async function HomePage() {
  const { content, galleries, categories } = await getData();
  
  return (
    <>
      <Header />
      
      <main>
        <HeroSection
          title={content.hero?.title}
          subtitle={content.hero?.subtitle}
          cta={content.hero?.cta}
          heroImage={content.hero?.heroImage}
        />
        
        <ServicesSection
          title={content.services?.title}
          subtitle={content.services?.subtitle}
          services={content.services?.items}
        />
        
        <GallerySection
          galleries={galleries}
          categories={categories}
        />
        
        <AboutSection
          title={content.about?.title}
          subtitle={content.about?.subtitle}
          advantages={content.about?.items}
        />
        
        <ProcessSection
          title={content.process?.title}
          subtitle={content.process?.subtitle}
          steps={content.process?.steps}
        />
        
        <CTASection
          title={content.cta?.title}
          subtitle={content.cta?.subtitle}
          buttonText={content.cta?.button}
        />
        
        <ContactSection />
      </main>
      
      <Footer />
    </>
  );
}
