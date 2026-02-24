# Vorágine Backend API (Express + MongoDB)

API CMS para el sitio de fotografía.

## Colecciones

- `Admin` (roles `admin` / `editor`)
- `Service`
- `Category`
- `Gallery` (proyectos/portfolio)
- `Page` (modular)
- `Post`
- `Testimonial`
- `Settings`
- `Message`

## Variables de entorno

Revisa `.env.example`. Claves críticas:

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `REVALIDATE_WEBHOOK_URL`
- `REVALIDATE_WEBHOOK_TOKEN`
- SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`)

## Comandos

```bash
npm install
npm run seed
npm run dev
npm start
```

## Endpoints principales

- `GET /api/health`
- `POST /api/admin/login`
- `GET /api/admin/me`
- `GET/POST/PUT/DELETE /api/services`
- `GET/POST/PUT/DELETE /api/categories`
- `GET/POST/PUT/DELETE /api/projects` (alias de galerías)
- `GET/POST/PUT/DELETE /api/pages`
- `GET/POST/PUT/DELETE /api/posts`
- `GET/POST/PUT/DELETE /api/testimonials`
- `GET/PUT /api/settings`
- `POST /api/contact` (honeypot + email)
- `GET /api/export` (admin backup)

## Seguridad

- Helmet
- Rate limiting (global/login/contacto)
- Sanitización de inputs
- Auth JWT
- Roles/permisos por endpoint

## Revalidación front

Después de mutaciones CMS, el backend dispara webhook a Next:

- `REVALIDATE_WEBHOOK_URL=http://localhost:3000/api/revalidate`
- Header `x-revalidate-token` con `REVALIDATE_WEBHOOK_TOKEN`
