import type { Testimonial } from '@/lib/cms';

type TestimonialsProps = {
  testimonials: Testimonial[];
};

export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials.length) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-narrow">
        <div className="mb-10 text-center">
          <p className="label text-voragine-accent">Testimonios</p>
          <h2 className="heading-md mt-3 text-voragine-black">Lo que dicen nuestros clientes</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article key={testimonial._id} className="rounded border border-black/10 bg-voragine-bg p-6">
              <p className="text-lg text-voragine-black">“{testimonial.quote}”</p>
              <div className="mt-4 text-sm text-voragine-gray">
                <p className="font-medium">{testimonial.name}</p>
                <p>{[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
