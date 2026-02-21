# 🖤 Vorágine Estudio

Estudio de fotografía especializado en bodas, eventos, fotografía personal y proyectos creativos.

## 🌐 URLs de Producción

| Servicio | URL |
|----------|-----|
| **Frontend (Web)** | https://voragine.vercel.app |
| **Panel Admin** | https://voragine.vercel.app/admin/login |
| **Backend API** | https://backend-vg.vercel.app/api |

## 🔐 Credenciales de Administrador

```
Usuario: admin
Contraseña: admin123
```

## 📋 Panel de Administración

El panel permite gestionar:

- **Dashboard** - Vista general del sistema
- **Galerías** - Crear, editar y eliminar galerías de fotos
- **Mensajes** - Ver mensajes de contacto recibidos
- **Configuración** - Editar información del sitio

### Acceso al Panel

1. Ve a: https://voragine.vercel.app/admin/login
2. Ingresa las credenciales: `admin` / `admin123`
3. Accede a las diferentes secciones del panel

## 🛠️ Tecnologías

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- Node.js + Express
- Funciones serverless en Vercel

## 📁 Estructura del Proyecto

```
voragine/
├── voragine/              # Frontend Next.js
│   ├── app/               # Páginas y rutas
│   │   ├── admin/         # Panel de administración
│   │   └── page.tsx       # Landing page
│   ├── components/        # Componentes React
│   └── lib/               # Utilidades y API
│
└── backend-vg/            # Backend Express
    ├── server.js          # Servidor principal
    └── vercel.json        # Configuración Vercel
```

## 🚀 Desarrollo Local

```bash
# Backend
cd backend-vg
npm install
npm start

# Frontend (en otra terminal)
cd voragine
npm install
npm run dev
```

## 📝 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/health | Estado del servidor |
| GET | /api/content | Contenido de todas las secciones |
| PUT | /api/content/:section | Actualizar sección |
| GET | /api/categories | Listar categorías |
| GET | /api/galleries | Listar galerías |
| POST | /api/contact | Enviar mensaje de contacto |
| GET | /api/settings | Configuración del sitio |
| PUT | /api/settings | Actualizar configuración |
| POST | /api/admin/login | Login de administrador |
| GET | /api/admin/me | Perfil del administrador |

## 📦 Repositorio

https://github.com/dondiaza/voragine-estudio

## 📄 Licencia

Proyecto privado para Vorágine Estudio.
