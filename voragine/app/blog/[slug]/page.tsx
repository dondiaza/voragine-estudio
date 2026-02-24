import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import SiteFrame from '@/components/site/SiteFrame';
import { getPostBySlug, getSettings, resolveMediaUrl, toCanonicalUrl } from '@/lib/cms';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const [settings, post] = await Promise.all([
    getSettings(),
    getPostBySlug(params.slug)
  ]);

  if (!post) {
    return {
      title: 'Artículo no encontrado',
      robots: { index: false, follow: false }
    };
  }

  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt || settings.seo?.defaultDescription || '';
  const canonical = toCanonicalUrl(post.seo?.canonical || `/blog/${post.slug}`, settings);
  const ogImage = resolveMediaUrl(post.seo?.ogImage || post.coverImage);

  return {
    title,
    description,
    alternates: { canonical },
    robots: post.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
      siteName: settings.siteName,
      images: ogImage ? [{ url: ogImage }] : undefined
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const [settings, post] = await Promise.all([
    getSettings(),
    getPostBySlug(params.slug)
  ]);

  if (!post) {
    notFound();
  }

  const cover = resolveMediaUrl(post.coverImage);

  return (
    <SiteFrame settings={settings}>
      <article className="section-padding">
        <div className="container-narrow">
          <p className="label text-voragine-accent">{post.category || 'Blog'}</p>
          <h1 className="heading-lg mt-3 text-voragine-black">{post.title}</h1>
          <p className="mt-4 text-sm text-voragine-gray">
            {post.author || 'Equipo Vorágine'} · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-ES') : ''}
          </p>
          {cover && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded">
              <Image src={cover} alt={post.title} fill className="object-cover" priority sizes="100vw" />
            </div>
          )}
          {post.excerpt && (
            <p className="mt-8 text-lg text-voragine-black">{post.excerpt}</p>
          )}
          <div className="prose prose-neutral mt-8 max-w-none text-voragine-gray">
            {(post.content || '').split('\n').filter(Boolean).map((line, index) => (
              <p key={index} className="mb-4 leading-7">
                {line}
              </p>
            ))}
          </div>
        </div>
      </article>
    </SiteFrame>
  );
}
