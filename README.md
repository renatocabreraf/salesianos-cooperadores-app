# Salesianos Cooperadores - App

Aplicación móvil para Android e iOS con panel administrativo web.

## Arquitectura

```
salesianos-cooperadores-app/
├── apps/
│   ├── admin/          → Next.js (Admin Panel + API REST)
│   └── mobile/         → React Native + Expo (App móvil)
├── packages/
│   ├── db/             → Prisma schema + PostgreSQL
│   ├── types/          → Tipos TypeScript compartidos
│   └── config/         → Configuraciones compartidas
├── turbo.json
└── pnpm-workspace.yaml
```

## Tecnologías

| Capa | Tecnología |
|---|---|
| Móvil | React Native + Expo SDK 52 |
| Admin | Next.js 15 (App Router) |
| API | Next.js Route Handlers |
| DB | PostgreSQL + Prisma 6 |
| Offline | expo-sqlite |
| Auth | Auth.js v5 |
| Archivos | AWS S3 / Cloudflare R2 |
| Notificaciones | expo-notifications |

## Requisitos

- Node.js >= 18
- pnpm >= 9
- PostgreSQL (local o Neon/Supabase)

## Instalación

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp apps/admin/.env.example apps/admin/.env
cp apps/mobile/.env.example apps/mobile/.env

# Generar cliente de Prisma
pnpm db:generate

# Crear tablas en la base de datos
pnpm db:push

# Cargar datos iniciales
pnpm db:seed
```

## Desarrollo

```bash
# Iniciar todo en paralelo
pnpm dev

# Solo admin
pnpm dev --filter=@repo/admin

# Solo app móvil
pnpm dev --filter=@repo/mobile
```

## Estructura de la Base de Datos

- **Category** - Categorías jerárquicas de documentos
- **Document** - Documentos, mensajes, directorios, etc.
- **PvaSection** - Proyecto de Vida Apostólica (capítulos/artículos)
- **BibleBook/BibleChapter/BibleVerse** - Biblia estructurada
- **User** - Administradores del panel
- **Favorite** - Favoritos por dispositivo
- **DeviceConfig** - Configuración por dispositivo
- **Notification** - Notificaciones push

## API Endpoints

### Públicos (App Móvil)
- `GET /api/documents` - Lista documentos
- `GET /api/documents/:slug` - Documento específico
- `GET /api/categories` - Árbol de categorías
- `GET /api/pva` - Secciones del PVA
- `GET /api/bible` - Libros de la Biblia
- `GET /api/search?q=` - Búsqueda global

### Admin (Requiere Auth)
- `POST /api/admin/documents` - Crear documento
- `PUT /api/admin/documents/:id` - Actualizar
- `DELETE /api/admin/documents/:id` - Eliminar
- `POST /api/admin/categories` - Crear categoría
- `POST /api/admin/pva` - Crear sección PVA
- `POST /api/notifications` - Enviar notificación

## Deployment

### Admin Panel (Vercel)
```bash
cd apps/admin
vercel deploy
```

### App Móvil
```bash
cd apps/mobile
# Android
eas build --platform android
# iOS
eas build --platform ios
```

## Offline

La app incluye soporte offline con expo-sqlite:
- PVA y Biblia se almacenan localmente
- Documentos se descargan bajo demanda
- Sincronización automática al reconectar
