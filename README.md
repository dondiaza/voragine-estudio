# 🖤 Vorágine Estudio

Estudio de fotografía especializado en bodas, eventos, fotografía personal y proyectos creativos.

## Descripción

Landing page elegante y minimalista con panel de administración para gestión de contenido.

### Características principales

- **Landing page premium** con diseño editorial contemporáneo
- **Galerías dinámicas** con lightbox y filtros por categoría
- **Panel de administración** completo para gestión de contenido
- **Formulario de contacto** con validación y persistencia
- **Diseño responsive** optimizado para todos los dispositivos
- **Animaciones suaves** con Framer Motion
- **SEO optimizado** para mejor visibilidad

### Stack tecnológico

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (upload de archivos)

## Inicio rápido

### Prerrequisitos

- Node.js 18+
- MongoDB 6+

### Instalación

1. **Clonar e instalar dependencias**

```bash
# Frontend
cd frontend
npm install
cp .env.example .env

# Backend
cd ../backend-vg
npm install
cp .env.example .env
```

2. **Configurar variables de entorno**

Backend (`backend-vg/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voragine
JWT_SECRET=tu-clave-secreta-muy-segura
JWT_EXPIRE=7d
NODE_ENV=development
```

Frontend (`frontend/.env`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. **Iniciar MongoDB**

```bash
mongod --dbpath /ruta/a/tu/data
```

4. **Poblar la base de datos**

```bash
cd backend-vg
npm run seed
```

5. **Iniciar servidores**

```bash
# Terminal 1 - Backend
cd backend-vg
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Acceder a la aplicación**

- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- API: http://localhost:5000/api

### Credenciales de administración

- **Usuario:** admin
- **Contraseña:** admin123

## Estructura del proyecto

```
voragine/
├── frontend/                # Aplicación Next.js
│   ├── app/                 # App Router
│   │   ├── admin/           # Panel de administración
│   │   ├── globals.css      # Estilos globales
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Landing page
│   ├── components/          # Componentes React
│   │   ├── sections/        # Secciones de landing
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilidades y API
│   └── public/              # Archivos estáticos
│
├── backend-vg/              # API REST
│   ├── config/              # Configuración
│   ├── middleware/          # Middleware Express
│   ├── models/              # Modelos Mongoose
│   ├── routes/              # Rutas API
│   ├── uploads/             # Archivos subidos
│   ├── seed.js              # Datos de prueba
│   └── server.js            # Servidor Express
│
└── README.md                # Este archivo
```

## Panel de administración

El panel permite gestionar:

- **Dashboard** - Vista general del sistema
- **Galerías** - Crear, editar y eliminar galerías
- **Mensajes** - Ver y gestionar mensajes de contacto
- **Configuración** - Ajustes del sitio

## Secciones de la landing

1. **Hero** - Imagen/vídeo full-width con claim principal
2. **Qué hacemos** - Servicios ofrecidos
3. **Galerías** - Portfolio con filtros y lightbox
4. **Por qué Vorágine** - Ventajas diferenciales
5. **Proceso** - Pasos de trabajo
6. **CTA** - Llamada a la acción
7. **Contacto** - Formulario de contacto

## API Endpoints

Ver documentación completa en `backend-vg/README.md`

## Producción

### Frontend

```bash
cd frontend
npm run build
npm start
```

### Backend

```bash
cd backend-vg
NODE_ENV=production npm start
```

### Variables de entorno producción

- Cambiar `JWT_SECRET` por una clave segura
- Usar MongoDB Atlas o similar
- Configurar HTTPS
- Configurar CDN para imágenes

## Licencia

Proyecto privado para Vorágine Estudio.
