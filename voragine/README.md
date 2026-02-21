# Vorágine Estudio - Frontend

Frontend moderno y elegante para el estudio de fotografía Vorágine.

## Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Framer Motion** - Animaciones fluidas
- **Lucide Icons** - Iconos elegantes

## Requisitos

- Node.js 18+
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## Estructura

```
frontend/
├── app/
│   ├── admin/          # Panel de administración
│   │   ├── dashboard/  # Dashboard principal
│   │   ├── galleries/  # Gestión de galerías
│   │   ├── messages/   # Mensajes de contacto
│   │   └── settings/   # Configuración
│   ├── globals.css     # Estilos globales
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Página principal
├── components/
│   ├── sections/       # Secciones de la landing
│   ├── Header.tsx      # Navegación
│   └── Footer.tsx      # Pie de página
├── hooks/              # Custom hooks
└── lib/                # Utilidades y API
```

## Variables de entorno

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Panel de administración

Accede a `/admin/login` para entrar al panel de administración.

Credenciales por defecto:
- Usuario: `admin`
- Contraseña: `admin123`

## Características

- Landing page elegante y minimalista
- Galerías con lightbox
- Formulario de contacto con validación
- Panel de administración completo
- Diseño responsive
- Animaciones suaves
- SEO optimizado
