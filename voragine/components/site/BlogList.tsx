import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/cms';
import { resolveMediaUrl } from '@/lib/cms';

type BlogListProps = {
  posts: Post[];
};

export default function BlogList({ posts }: BlogListProps) {
  if (!posts.length) {
    return (
      <p className="rounded border border-dashed border-black/20 p-8 text-center text-voragine-gray">
        Aún no hay artículos publicados.
      </p>
    );
  }

  return (
    <section id="articulos" className="section-padding">
      <div className="container-fluid grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => {
          const image = resolveMediaUrl(post.coverImage);
          return (
            <article key={post._id} className="overflow-hidden rounded border border-black/10 bg-white">
              <div className="relative aspect-[4/3] bg-black/5">
                {image ? (
                  <Image
                    src={image}
                    alt={post.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-voragine-gray">
                    Sin portada
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <p className="text-xs uppercase tracking-wide text-voragine-accent">
                  {post.category || 'Blog'} · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-ES') : ''}
                </p>
                <h2 className="font-serif text-2xl text-voragine-black">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-voragine-gray">{post.excerpt}</p>}
                <Link href={`/blog/${post.slug}`} className="btn-secondary w-full">
                  Leer artículo
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
