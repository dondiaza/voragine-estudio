# Vorágine Estudio (Front + Back + CMS)

Repositorio full-stack para web corporativa de fotografía con contenido 100% configurable:

- `voragine/`: Frontend Next.js 14 (sitio público + panel CMS).
- `backend-vg/`: API Express + MongoDB (colecciones CMS, auth, seguridad, email, revalidación).

## Arquitectura

- Front público con rutas: `/`, `/servicios`, `/portfolio`, `/portfolio/[slug]`, `/sobre-nosotros`, `/contacto`, `/blog`, `/blog/[slug]`.
- CMS en `/admin/*` con módulos para servicios, categorías, portfolio, páginas, blog, testimonios, mensajes, ajustes globales y usuarios.
- Backend con modelos CMS:
  - `Service`
  - `Gallery` (portfolio/proyectos)
  - `Category`
  - `Page` (contenido modular)
  - `Post` (blog)
  - `Testimonial`
  - `Settings` (global/contacto/SEO/CTAs/business)
  - `Admin` (roles `admin` y `editor`)
- Revalidación ISR vía webhook: backend -> `POST /api/revalidate` (Next).
- Export de backup CMS: `GET /api/export` (solo admin).

## Requisitos

- Node.js 18+
- MongoDB 6+

## Setup Local

1. Backend:

```bash
cd backend-vg
npm install
cp .env.example .env
```

2. Frontend:

```bash
cd voragine
npm install
cp .env.example .env
```

3. Configura variables importantes:

- Backend `.env`:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `CORS_ORIGINS`
  - SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) si quieres email real
  - `REVALIDATE_WEBHOOK_URL=http://localhost:3000/api/revalidate`
  - `REVALIDATE_WEBHOOK_TOKEN=<mismo token del front>`
- Frontend `.env`:
  - `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
  - `CMS_API_URL=http://localhost:5000/api`
  - `REVALIDATE_TOKEN=<mismo token del back>`
  - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

4. Seed inicial:

```bash
cd backend-vg
npm run seed
```

Credenciales seed:

- `admin / admin12345`
- `editor / editor12345`

5. Ejecutar:

```bash
# terminal 1
cd backend-vg
npm run dev

# terminal 2
cd voragine
npm run dev
```

## URLs Locales

- Sitio: `http://localhost:3000`
- CMS: `http://localhost:3000/admin/login`
- API: `http://localhost:5000/api`

## Flujo CMS

1. Crear/ordenar `Categorías`.
2. Crear `Servicios`.
3. Cargar `Portfolio` (proyectos + imágenes + tags + categoría).
4. Editar `Páginas` y SEO por página.
5. Publicar artículos en `Blog`.
6. Gestionar `Testimonios`.
7. Ajustar `Configuración global` (contacto, CTAs, SEO, schema business).

## Seguridad y Operación

- Auth JWT para panel.
- Roles/permisos: `admin`, `editor`.
- Rate limit global, login y contacto.
- Sanitización de input.
- CORS configurable.
- Honeypot anti-spam en formulario.
- Export de backup desde CMS (`Configuración -> Exportar backup`).

## Despliegue recomendado

- Frontend: Vercel (Next.js).
- Backend: Vercel/Render/Fly con Mongo Atlas.
- Dominios:
  - Front: `www.tudominio.com`
  - API: `api.tudominio.com`
- SSL gestionado por el proveedor.
- Configurar webhook de revalidación (`REVALIDATE_WEBHOOK_URL`) apuntando al dominio del front.

## CI/CD

- Pipeline base incluido: `.github/workflows/ci.yml`.
- Ejecuta en push/PR:
  - install backend + sanity check
  - install frontend + `next build`

## Verificación rápida

- `GET /api/health` responde `database: connected`.
- Cambiar un servicio/proyecto en CMS actualiza front (tras webhook revalidate).
- Formulario contacto crea mensaje y envía mail si SMTP está configurado.
- `sitemap.xml` y `robots.txt` disponibles en el front.
