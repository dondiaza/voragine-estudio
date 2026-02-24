# Vorágine Frontend (Next.js)

Frontend público + panel CMS.

## Rutas públicas

- `/`
- `/servicios`
- `/portfolio`
- `/portfolio/[slug]`
- `/sobre-nosotros`
- `/contacto`
- `/blog`
- `/blog/[slug]`

## Rutas CMS

- `/admin/login`
- `/admin/dashboard`
- `/admin/services`
- `/admin/categories`
- `/admin/projects`
- `/admin/pages`
- `/admin/blog`
- `/admin/testimonials`
- `/admin/messages`
- `/admin/settings`
- `/admin/users`

## Variables de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
CMS_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATE_TOKEN=change-me
BACKEND_INTERNAL_URL=http://localhost:5000
```

## Comandos

```bash
npm install
npm run dev
npm run build
npm start
```

## SEO técnico

- Metadata por página (title/description/canonical/og).
- `app/sitemap.ts`.
- `app/robots.ts`.
- Schema `Organization/LocalBusiness` inyectado con settings globales.
- Endpoint de revalidación: `POST /api/revalidate`.
