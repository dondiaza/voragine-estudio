'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { Category, Project } from '@/lib/cms';
import { resolveMediaUrl } from '@/lib/cms';

type PortfolioGalleryProps = {
  projects: Project[];
  categories: Category[];
};

type SortMode = 'order' | 'latest' | 'title';

const sortLabels: Record<SortMode, string> = {
  order: 'Destacados',
  latest: 'Más recientes',
  title: 'A-Z'
};

export default function PortfolioGallery({ projects, categories }: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [sortMode, setSortMode] = useState<SortMode>('order');
  const [lightbox, setLightbox] = useState<{ project: Project; index: number } | null>(null);

  const tags = useMemo(() => {
    const values = new Set<string>();
    projects.forEach((project) => project.tags?.forEach((tag) => values.add(tag)));
    return Array.from(values).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const byCategory = activeCategory === 'all'
      ? projects
      : projects.filter((project) => project.category?.slug === activeCategory);

    const byTag = activeTag === 'all'
      ? byCategory
      : byCategory.filter((project) => project.tags?.includes(activeTag));

    const sorted = [...byTag];
    if (sortMode === 'latest') {
      sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortMode === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    return sorted;
  }, [activeCategory, activeTag, projects, sortMode]);

  useEffect(() => {
    if (!lightbox) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowLeft') changeLightbox(-1);
      if (event.key === 'ArrowRight') changeLightbox(1);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  });

  const openLightbox = (project: Project, imageIndex = 0) => {
    setLightbox({ project, index: imageIndex });
  };

  const changeLightbox = (step: number) => {
    setLightbox((current) => {
      if (!current) return current;
      const length = current.project.images.length;
      if (!length) return current;
      const nextIndex = (current.index + step + length) % length;
      return { ...current, index: nextIndex };
    });
  };

  const currentImage = lightbox?.project.images[lightbox.index];
  const currentImageUrl = resolveMediaUrl(currentImage?.url || lightbox?.project.coverImage);

  return (
    <section id="proyectos" className="section-padding">
      <div className="container-fluid">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="heading-md text-voragine-black">Proyectos</h2>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(sortLabels) as SortMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSortMode(mode)}
                className={`rounded border px-3 py-2 text-xs uppercase tracking-wide ${
                  sortMode === mode
                    ? 'border-voragine-black bg-voragine-black text-white'
                    : 'border-black/20 bg-white text-voragine-gray'
                }`}
              >
                {sortLabels[mode]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide ${
              activeCategory === 'all'
                ? 'border-voragine-black bg-voragine-black text-white'
                : 'border-black/20 bg-white text-voragine-gray'
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide ${
                activeCategory === category.slug
                  ? 'border-voragine-black bg-voragine-black text-white'
                  : 'border-black/20 bg-white text-voragine-gray'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag('all')}
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-wide ${
                activeTag === 'all'
                  ? 'border-voragine-accent bg-voragine-accent text-white'
                  : 'border-voragine-accent/40 bg-white text-voragine-gray'
              }`}
            >
              Todas las etiquetas
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-wide ${
                  activeTag === tag
                    ? 'border-voragine-accent bg-voragine-accent text-white'
                    : 'border-voragine-accent/40 bg-white text-voragine-gray'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <p className="mt-10 rounded border border-dashed border-black/20 p-8 text-center text-voragine-gray">
            No hay proyectos para los filtros seleccionados.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => {
              const image = resolveMediaUrl(project.coverImage || project.images[0]?.url);
              return (
                <article key={project._id} className="overflow-hidden rounded border border-black/10 bg-white">
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => openLightbox(project)}
                    aria-label={`Abrir galería ${project.title}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                      {image ? (
                        <Image
                          src={image}
                          alt={project.title}
                          fill
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-voragine-gray">Sin imagen</div>
                      )}
                    </div>
                  </button>
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="label text-voragine-accent">{project.category?.name || 'Proyecto'}</p>
                      <h3 className="mt-2 font-serif text-2xl text-voragine-black">{project.title}</h3>
                    </div>
                    {project.description && (
                      <p className="text-sm leading-relaxed text-voragine-gray">{project.description}</p>
                    )}
                    {project.tags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded bg-black/5 px-2 py-1 text-xs text-voragine-gray">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <Link href={`/portfolio/${project.slug}`} className="btn-secondary w-full">
                      Ver caso
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded border border-white/20 p-2 text-white"
            aria-label="Cerrar lightbox"
          >
            <X size={20} />
          </button>

          {lightbox.project.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => changeLightbox(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded border border-white/20 p-2 text-white"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => changeLightbox(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/20 p-2 text-white"
                aria-label="Imagen siguiente"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div className="mx-auto mt-14 flex h-[calc(100vh-7rem)] max-w-6xl flex-col items-center justify-center gap-4">
            {currentImageUrl ? (
              <div className="relative h-full w-full">
                <Image
                  src={currentImageUrl}
                  alt={currentImage?.alt || lightbox.project.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            ) : (
              <p className="text-white">Imagen no disponible</p>
            )}
            <div className="text-center text-white">
              <p className="font-serif text-2xl">{lightbox.project.title}</p>
              <p className="text-sm text-white/70">
                {lightbox.index + 1} / {lightbox.project.images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
