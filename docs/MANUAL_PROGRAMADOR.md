# FeelWeell — Manual de Programador

> Guía técnica del proyecto. Si mañana un dev nuevo entra al equipo, esta guía debe permitirle levantar el sistema y entender cómo funciona por dentro sin necesidad de preguntar.

---

## Índice

1. [Arranque rápido / Onboarding](#1-arranque-rápido--onboarding)
2. [Arquitectura general](#2-arquitectura-general)
3. [Código y estándares](#3-código-y-estándares)
4. [Base de datos](#4-base-de-datos)
5. [APIs y servicios](#5-apis-y-servicios)
6. [Variables de entorno y Seeders](#6-variables-de-entorno-y-seeders)
7. [Deploy y entornos](#7-deploy-y-entornos)
8. [Problemas comunes / Troubleshooting](#8-problemas-comunes--troubleshooting)
9. [Seguridad](#9-seguridad)

---

## 1. Arranque rápido / Onboarding

### Requisitos

- Node.js
- pnpm
- Docker
- .NET 8 SDK (para Daily Positive Service)

### Instalación

```bash
git clone <repo>
```

Instala dependencias en cada servicio y en el cliente:

```bash
cd auth-service && pnpm install
cd healthy-service && pnpm install
cd mood-tracking && pnpm install
cd ai-chat-service && pnpm install
cd client-admin && pnpm install
```

### Variables de entorno

Cada servicio tiene su propio `.env` (ver sección 6). El `JWT_SECRET` debe ser **idéntico en todos los servicios** para que la validación de tokens funcione entre microservicios.

### Correr en local

**Opción rápida (todo con Docker):**

```bash
docker compose up --build -d
```

**Opción manual (por servicio):**

Primero levanta MongoDB y RabbitMQ:

```bash
cd pg-rabbitmq
docker compose up -d
```

Luego cada servicio en su propia terminal:

```bash
# Auth Service
cd auth-service && pnpm start

# Healthy Service
cd healthy-service && pnpm start

# Mood Tracking Service
cd mood-tracking && pnpm start

# AI Chat Service
cd ai-chat-service && pnpm start

# Daily Positive Service (.NET)
cd daily-positive-service && dotnet run

# Cliente web
cd client-admin && pnpm dev
```

---

## 2. Arquitectura general

### Diagrama de conexión

```
Cliente (React + Vite)
        │
        ├──▶ Auth Service (Node.js)
        ├──▶ Healthy Service (Node.js)
        ├──▶ Mood Tracking Service (Node.js) ──▶ RabbitMQ
        ├──▶ AI Chat Service (Node.js) ──▶ Groq API
        └──▶ Daily Positive Service (.NET 8)

Todos los servicios Node.js + .NET ──▶ MongoDB
```

### Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite, Zustand (estado) |
| Backend | Node.js (Auth, Healthy, Mood Tracking, AI Chat) |
| Backend | .NET 8 — Clean Architecture (Daily Positive) |
| Base de datos | MongoDB 7 |
| Mensajería | RabbitMQ 3 |
| Imágenes | Cloudinary |
| IA | Groq (`llama-3.1-8b-instant`) |
| Contenedores | Docker |

### Estructura de carpetas

```
FEELWEELL/
├── auth-service/           # Autenticación y usuarios
├── healthy-service/        # Ejercicios, contenido, notificaciones
├── mood-tracking/          # Estado de ánimo y rachas
├── ai-chat-service/        # Chat con Tiyú (IA)
├── daily-positive-service/  # Mensajes motivacionales (.NET, Clean Architecture)
├── client-admin/           # Frontend React + Vite
│   └── src/features/       # auth, chat, contents, dashboard, exercises, mood, notifications, users
├── pg-rabbitmq/            # docker-compose de RabbitMQ
└── docker-compose.yml      # Orquestación completa del sistema
```

Cada microservicio Node.js sigue el mismo patrón interno:

```
servicio/
├── configs/      # servidor, DB, CORS, Helmet, rate limiting, Swagger
├── middlewares/  # JWT, roles, validadores, manejo de errores
├── helpers/      # utilidades (email, Cloudinary, etc.)
└── src/          # modelos, controladores, servicios y rutas
```

### Flujo de datos (ejemplo)

1. El usuario registra su estado de ánimo desde el frontend.
2. Mood Tracking Service guarda el registro en MongoDB.
3. Publica un evento en RabbitMQ.
4. Healthy Service escucha ese evento y puede disparar una notificación o recordatorio relacionado.

---

## 3. Código y estándares

### Convenciones de commits

Mensajes cortos en español, formato conventional commits:

```
feat(scope): Descripción
fix(scope): Descripción
```

### Patrones usados

- **Node.js:** capas `configs / middlewares / helpers / src` (similar a MVC)
- **.NET:** Clean Architecture (`Api / Application / Domain / Persistence`)
- **Frontend:** organización por *features*, con Zustand para manejo de estado

### Buenas prácticas del equipo

- Avisar a los compañeros antes de tocar archivos compartidos, para evitar conflictos de merge.
- Evitar cambios de fin de línea (CRLF/LF) innecesarios al hacer commit.
- Mantener el README/docs actualizado si se agregan o cambian endpoints.

---

## 4. Base de datos

MongoDB es la base de datos principal, con colecciones separadas por servicio:

| Servicio | Colecciones principales |
|---|---|
| Auth Service | Usuarios (datos personales, credenciales, rol, estado de activación) |
| Mood Tracking Service | `moodEntry` (+30 estados: `FELIZ`, `TRISTE`, `ANSIOSO`, etc.), `streak`, perfiles emocionales |
| Healthy Service | Ejercicios (tipo, duración, instrucciones, perfil objetivo), contenidos educativos (con borrado lógico `isDeleted`), notificaciones y preferencias |
| AI Chat Service | Historial de conversaciones con Tiyú |
| Daily Positive Service (.NET) | Mensajes motivacionales (con soft delete) |

### Reglas importantes

- Las cuentas nuevas se crean con `isActive: false` y requieren activación por correo antes de poder iniciar sesión.
- El borrado de ejercicios y contenidos es **lógico** (`isDeleted: true`), nunca físico.

RabbitMQ se usa como broker de mensajería para el Mood Tracking Service.

---

## 5. APIs y servicios

### Base URLs

| Servicio | URL Base |
|---|---|
| Auth Service | `http://localhost:3006/feelWeell/v1` |
| Healthy Service | `http://localhost:3008/feelWeell/v1` |
| Mood Tracking Service | `http://localhost:3001/feelWeell/v1` |
| AI Chat Service | `http://localhost:3007/feelWeell/v1` |
| Daily Positive Service | `http://localhost:5001` |

### Auth Service (`/auth`)

Registro, activación por correo, login, recuperación/restablecimiento de contraseña, cambio de contraseña autenticado.

### Healthy Service

- `/exercises` — CRUD de ejercicios, progreso del usuario, recomendados, reto diario
- `/contents` — CRUD de contenido educativo, filtrado por categoría
- `/notifications` — notificaciones del usuario, preferencias, recordatorios

### Mood Tracking Service

- `/moodTracking/mood` — registrar/consultar ánimo, historial, cuestionario, perfil emocional
- `/streak` — consultar/actualizar racha, verificar si está en riesgo
- `/admin/*` — administración (rol `admin-MoodTracking`)

### AI Chat Service — Tiyú

`POST /chat` — pipeline: validación JWT → validación del mensaje → guarda de tema fuera de alcance → detección de crisis → respuesta de la IA (`llama-3.1-8b-instant` vía Groq).

### Daily Positive Service (.NET)

`GET /api/daily-message/today/:userId`, más endpoints de administración de mensajes (`/api/admin/messages`).

> Cada servicio Node.js documenta sus endpoints en Swagger (`/api-docs`); el de .NET, en `/swagger`.

### Autenticación

JWT vía header `Authorization: Bearer <token>` (algunos endpoints de Healthy Service también aceptan `x-token`). El token expira en `1h` por defecto (`JWT_EXPIRES_IN`).

### Servicios externos

- **Cloudinary** — almacenamiento de imágenes
- **Groq** — IA de Tiyú
- **Nodemailer** — correos transaccionales

---

## 6. Variables de entorno y Seeders

Cada servicio necesita su propio `.env`. El de Auth Service, además de la configuración de Mongo y JWT, incluye los **seeders** que crean automáticamente las cuentas de administrador al levantar el servicio (si no existen ya en la base de datos):

```env
# -----------------
# Seeders (Admin y Usuarios Base)
# -----------------
SEEDER_ADMIN_EMAIL=admin@feelwell.com
SEEDER_ADMIN_PASSWORD=Admin123!FeelWell
SEEDER_ADMIN_USERS_EMAIL=admin.users@feelwell.com
SEEDER_ADMIN_USERS_PASSWORD=AdminUsers123!FeelWell
SEEDER_ADMIN_MOOD_EMAIL=admin.mood@feelwell.com
SEEDER_ADMIN_MOOD_PASSWORD=AdminMood123!FeelWell
SEEDER_ADMIN_HEALTHY_EMAIL=admin.healthy@feelwell.com
SEEDER_ADMIN_HEALTHY_PASSWORD=AdminHealthy123!FeelWell
```

Cada variable corresponde a un rol de administrador. Si cambias estos valores en el `.env` **antes del primer arranque**, esas serán las credenciales con las que se crea cada cuenta.

### Roles del sistema

| Rol | Descripción |
|---|---|
| `USER_ROLE` | Usuario estándar (asignado automáticamente al registrarse) |
| `ADMIN_ROLE` | Administrador principal |
| `ADMIN_USERS_ROLE` | Administrador de usuarios |
| `ADMIN_MOODTRACKING_ROLE` | Administrador de seguimiento de ánimo |
| `ADMIN_HEALTHY_ROLE` | Administrador de ejercicios y contenidos |

---

## 7. Deploy y entornos

| Entorno | Dónde corre |
|---|---|
| Local / Desarrollo | Orquestación completa vía Docker (`docker compose up --build -d`) |
| Producción | Vercel (frontend) y Render (backend/servicios) |

> Completa aquí, si aplica: URLs de producción, variables de entorno específicas de cada entorno, y pasos exactos de deploy en Vercel/Render (o si el deploy es automático vía integración con GitHub).

---

## 8. Problemas comunes / Troubleshooting

| Problema | Solución |
|---|---|
| `Cannot connect to DB` | Revisa que MongoDB esté corriendo en el puerto `27017` |
| Token JWT inválido entre servicios | Verifica que `JWT_SECRET` sea exactamente igual en todos los `.env` |
| No llegan los correos de activación | Revisa las credenciales de email en `auth-service/.env` |
| El chat con Tiyú no responde | Verifica que `GROQ_API_KEY` esté configurada en `ai-chat-service/.env` |

---

## 9. Seguridad

- **No subir el `.env` a git** — ahí están las credenciales de Mongo, JWT, Cloudinary, Groq y los seeders de administradores.
- **Roles y permisos:** ver tabla de roles en la sección 6.
- **Secrets:** `JWT_SECRET`, `GROQ_API_KEY`, credenciales de Cloudinary y RabbitMQ — todos en variables de entorno, nunca hardcodeados en el código.
- Las contraseñas de usuario se encriptan con `@node-rs/bcrypt` antes de guardarse.
