# Vorágine Estudio - Backend API

Backend REST API para el estudio de fotografía Vorágine.

## Tecnologías

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Multer** - Subida de archivos

## Requisitos

- Node.js 18+
- MongoDB 6+
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar MongoDB (si no está corriendo)
mongod --dbpath /path/to/data

# Poblar base de datos con datos de prueba
npm run seed

# Desarrollo
npm run dev

# Producción
npm start
```

## Variables de entorno

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voragine
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Estructura

```
backend-vg/
├── config/         # Configuración (DB, JWT)
├── middleware/     # Middleware (auth, upload)
├── models/         # Modelos Mongoose
├── routes/         # Rutas API
├── uploads/        # Archivos subidos
├── seed.js         # Datos de prueba
└── server.js       # Punto de entrada
```

## API Endpoints

### Autenticación
- `POST /api/admin/login` - Login administrador
- `GET /api/admin/me` - Perfil actual
- `POST /api/admin/change-password` - Cambiar contraseña

### Contenido
- `GET /api/content` - Todo el contenido
- `GET /api/content/:section` - Sección específica
- `PUT /api/content/:section` - Actualizar sección

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:slug` - Obtener categoría
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Galerías
- `GET /api/galleries` - Listar galerías
- `GET /api/galleries/:slug` - Obtener galería
- `POST /api/galleries` - Crear galería
- `PUT /api/galleries/:id` - Actualizar galería
- `DELETE /api/galleries/:id` - Eliminar galería
- `POST /api/galleries/:id/images` - Añadir imágenes
- `DELETE /api/galleries/:id/images/:imageId` - Eliminar imagen

### Contacto
- `POST /api/contact` - Enviar mensaje
- `GET /api/contact` - Listar mensajes (admin)
- `GET /api/contact/:id` - Ver mensaje
- `PUT /api/contact/:id/archive` - Archivar mensaje
- `DELETE /api/contact/:id` - Eliminar mensaje

### Configuración
- `GET /api/settings` - Obtener configuración
- `PUT /api/settings` - Actualizar configuración

### Upload
- `POST /api/upload/:type` - Subir imagen
- `POST /api/upload/multiple/:type` - Subir múltiples imágenes
- `DELETE /api/upload/:type/:filename` - Eliminar archivo

## Modelos

### Admin
- username (único)
- password (hasheado)
- email
- name

### Category
- name
- slug (único)
- description
- image
- order
- active

### Gallery
- title
- slug (único)
- description
- category (ref)
- images[]
- coverImage
- featured
- active

### Message
- name
- email
- phone
- projectType
- message
- read
- archived

### Content
- section (único)
- data (Mixed)

### Settings
- siteName
- tagline
- email
- phone
- address
- social{}

## Autenticación

El panel de administración usa JWT para autenticación. Incluye el token en el header:

```
Authorization: Bearer <token>
```

## Datos de prueba

Después de ejecutar `npm run seed`:

- Usuario admin: `admin` / `admin123`
- 4 categorías creadas
- Galerías de ejemplo
- Contenido precargado
