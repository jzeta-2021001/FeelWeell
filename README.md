# FeelWell – Plataforma de Apoyo Emocional

> **Nota**: Este proyecto está basado en un trabajo con nombre "Kinal Sports" desarrollado por Braulio Echeverría para el curso IN6AM - Kinal Guatemala. Se realizaron modificaciones con fines académicos, forma parte de una arquitectura de microservicios diseñada para brindar acompañamiento emocional y seguimiento del bienestar personal mediante tecnologías modernas como Node.js, MongoDB y C# con .NET.

**Nota**:
Link de Tablero de Trello:
(https://trello.com/invite/b/699c57c38a10fa0ded5e8712/ATTI5d93119ee8c5088bcf8bcdc41dff845c2111CB8C/problema-social)

Link de documento de Evidencia del Trabajo y Participación del Grupo:
https://cetkinal-my.sharepoint.com/:b:/g/personal/jzeta-2021001_kinal_edu_gt/IQDjC6HJ2556SY93PWHW03-FAVN2D3dlON7cL8fN5hUA3PI?e=UGWghK

Link de Reunión de Retrospectiva SCRUM:
https://teams.microsoft.com/l/meetingrecap?driveId=b%21nc5gst8WakC5wzP0JwvKZyc_9EavZQFElLhzdE3PDT6n0YIvVgZtR6m70X5RBf5h&driveItemId=01FF42JWJIFHHEU6SV7NAKEBJUIYZMNYX3&sitePath=https%3A%2F%2Fcetkinal-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fjzeta-2021001_kinal_edu_gt%2FIQAoKc5KelX7QKIFNEYyxuL7AYrHgfyh5X540Ti4TzH_gL4&fileUrl=https%3A%2F%2Fcetkinal-my.sharepoint.com%2Fpersonal%2Fjzeta-2021001_kinal_edu_gt%2FDocuments%2FRecordings%2FReuni%C3%B3n+en+DebuggersIN6AM-20260306_213951-Grabaci%C3%B3n+de+la+reuni%C3%B3n.mp4%3Fweb%3D1&threadId=19%3A470e8b5d06164b0d9ea0931c8784b3db%40thread.v2&organizerId=268cc993-5c26-4bd0-9c7b-267e2243c1a7&tenantId=5545b48f-b22f-4bbb-bba5-7f5040667180&callId=e9f8adaf-6683-445d-ab13-620bcb7cb600&threadType=GroupChat&meetingType=Adhoc&subType=RecapSharingLink_RecapCore

---

# Descripción

**FeelWell** es una plataforma de apoyo emocional diseñada para acompañar a los usuarios en su bienestar psicológico y mental. La aplicación proporciona consejos, ejercicios y recursos que ayudan a fortalecer el cuidado emocional, promoviendo hábitos saludables sin reemplazar a los especialistas, sino siendo una herramienta de seguimiento constante.

La plataforma está orientada a jóvenes y personas que enfrentan situaciones de estrés académico, laboral o personal, y necesitan un espacio accesible para el cuidado de su salud mental.

El sistema está basado en una arquitectura de microservicios, donde cada servicio es responsable de una funcionalidad específica, permitiendo mayor escalabilidad, mantenibilidad y seguridad.

Actualmente, el sistema cuenta con los siguientes servicios principales:

- Auth Service
- Healthy Service (Ejercicios, contenido y notificaciones)
- Daily Positive Service (.NET)
- Mood Tracking Service (Seguimiento del estado de ánimo y rachas)

---

# Arquitectura General

El sistema implementa una arquitectura basada en microservicios, donde cada servicio se organiza en las siguientes capas:

- **API**: Maneja las solicitudes HTTP, rutas y controladores
- **Application**: Contiene los casos de uso y lógica de negocio
- **Domain**: Define las entidades, reglas y contratos del sistema
- **Persistence / Infrastructure**: Gestiona el acceso a bases de datos

Esta arquitectura permite mantener una separación clara de responsabilidades, facilitando el mantenimiento y crecimiento del sistema.

---

# Auth Service

## Descripción

El Auth Service es el encargado de gestionar la autenticación, autorización y administración de usuarios dentro de la plataforma FeelWell.

Este servicio permite registrar usuarios, iniciar sesión de forma segura y gestionar los roles del sistema, asegurando que cada usuario tenga acceso únicamente a las funcionalidades que le corresponden.

También actúa como el núcleo de seguridad del sistema, validando la identidad de los usuarios y protegiendo los endpoints de los demás microservicios.

## Funcionalidades Principales

### Autenticación

- Registro de nuevos usuarios en la plataforma
- Inicio de sesión mediante correo y contraseña
- Generación de tokens JWT para autenticación segura
- Validación de credenciales del usuario
- Identificación del usuario autenticado

### Autorización

El sistema maneja los siguientes roles:

- **Administrador** (`ADMIN_ROLE`)
- **Usuario** (`USER_ROLE`)

Funcionalidades relacionadas:

- Asignación automática del rol Usuario al registrarse
- Creación de usuarios con roles específicos por el administrador
- Control de acceso basado en roles
- Protección de endpoints mediante JWT Bearer
- Restricción de acceso según permisos

### Seguridad

- Encriptación de contraseñas utilizando hash seguro (bcrypt)
- Generación de tokens JWT firmados
- Validación de tokens en cada solicitud protegida
- Protección contra accesos no autorizados
- Validación de datos de entrada

### Arquitectura del Servicio

El servicio está organizado en:

- **configs**: Configuración del servidor, base de datos y CORS
- **helpers**: Utilidades del servicio (email helper)
- **middlewares**: JWT, roles y validadores
- **src**: Controladores, rutas y lógica de usuarios

---

# Healthy Service

## Descripción

El Healthy Service gestiona los ejercicios de bienestar, el contenido educativo y el sistema de notificaciones y recordatorios de la plataforma FeelWell.

Este servicio funciona en conjunto con el Auth Service para validar la identidad y permisos de los usuarios.

## Funcionalidades Principales

### Ejercicios y Contenido de Bienestar

- Catálogo de ejercicios de relajación y motivación
- Material educativo (videos, artículos, recursos informativos)
- Contenido relacionado con manejo de estrés, depresión y desarrollo personal
- Hábitos saludables que favorezcan el bienestar emocional
- Subida de imágenes mediante Cloudinary

### Notificaciones y Recordatorios

- Alertas cuando la racha del usuario está en riesgo de perderse
- Recordatorios de ejercicios de bienestar pendientes
- Notificaciones para fomentar el registro diario del estado de ánimo
- Motivación mediante recordatorios oportunos

### Seguridad

- Protección de endpoints mediante JWT
- Validación de identidad del usuario autenticado
- Restricción de acceso según rol
- Integración con Auth Service

### Arquitectura del Servicio

El servicio está organizado en:

- **configs**: Configuración del servidor, base de datos y CORS
- **helpers**: Utilidades del servicio (Cloudinary)
- **middlewares**: JWT, roles, validadores y manejo de archivos
- **src/contents**: Gestión de contenido educativo y recursos
- **src/exercises**: Ejercicios y actividades de bienestar
- **src/notifications**: Notificaciones y recordatorios

---

# Daily Positive Service

## Descripción

El Daily Positive Service es un microservicio construido en **.NET 8** encargado de gestionar el módulo de refuerzo positivo diario de la plataforma FeelWell.

Este servicio implementa un módulo de acompañamiento activo que recibe al usuario con un mensaje motivador en su primer acceso del día, compuesto estratégicamente por afirmaciones positivas o citas de resiliencia.

## Funcionalidades Principales

- Generación de mensajes motivadores diarios por usuario
- Afirmaciones positivas y citas de resiliencia
- Registro del primer acceso diario del usuario
- Anclaje emocional saludable al inicio del día
- Fomento del ingreso constante a la aplicación

### Arquitectura del Servicio

El servicio sigue una arquitectura limpia en capas:

- **DailyPositive.Api**: Controladores, middlewares, `appsettings.json` y `Program.cs`
- **DailyPositive.Application**: DTOs, interfaces y servicios de aplicación
- **DailyPositive.Domain**: Entidades e interfaces del dominio
- **DailyPositive.Persistence**: Repositorios, contexto de MongoDB y seeders de datos
- **global.json**: Versión fijada del SDK de .NET
- **DailyPositiveService.sln**: Solución de Visual Studio

---

# Mood Tracking Service

## Descripción

El Mood Tracking Service es el microservicio dedicado al registro, análisis y seguimiento del estado de ánimo del usuario. Gestiona el historial emocional, las rachas de uso continuo y el cuestionario de evaluación inicial, con integración a RabbitMQ para comunicación entre servicios.

## Funcionalidades Principales

### Seguimiento del Estado de Ánimo

- Registro diario de emociones con nivel de intensidad y notas
- Consulta del registro del día y del historial completo
- Cuestionario inicial de evaluación psicológica
- Perfil emocional del usuario
- Publicación de eventos via RabbitMQ

### Rachas (Streaks)

- Consulta de la racha actual del usuario
- Actualización automática de la racha tras cada registro
- Verificación si la racha está en riesgo de perderse

### Administración

- Listado y eliminación de entradas de mood (rol `admin-MoodTracking`)
- Gestión y reseteo de rachas de usuarios
- Consulta de perfiles de usuarios
- Estadísticas generales del sistema

### Seguridad

- Protección de endpoints mediante JWT
- Validación de identidad del usuario autenticado
- Rol específico `admin-MoodTracking` para rutas administrativas

### Arquitectura del Servicio

El servicio está organizado en:

- **configs**: `app.js`, `db.configuration.js`, `cors.configuration.js`, `helmet.configuration.js`, `rateLimit.configuration.js`
- **middlewares**: `validate-JWT.js`, `validate-role.js`, `mood-validator.js`, `tracking-validator.js`, `check-validator.js`, `handle-errors.js`
- **src/mood-tracking**: Controladores, servicios, rutas y modelos de mood, streak y administración; `rabbitmq.service.js`

---

# Tecnologías Utilizadas

## Backend

- Node.js
- Express.js
- JavaScript
- C# con .NET 8
- Arquitectura de Microservicios
- RabbitMQ (mensajería entre servicios en Mood Tracking)

## Base de Datos

### MongoDB

Utilizado en:

- Usuarios y autenticación (Auth Service)
- Ejercicios, contenido y notificaciones (Healthy Service)
- Mensajes motivadores diarios (Daily Positive Service)
- Registros emocionales y rachas (Mood Tracking Service)

Tecnología: Mongoose ODM (Node.js) / MongoDB.Driver (C# .NET)

## Almacenamiento de Archivos

- Cloudinary — para imágenes de ejercicios y contenido (Healthy Service)

## Seguridad

- JWT Authentication (jsonwebtoken / Microsoft.AspNetCore.Authentication.JwtBearer)
- Hash de contraseñas con bcrypt
- Validación de datos con express-validator
- Helmet y Rate Limiting en todos los servicios Node.js

## Herramientas de Gestión

- Trello — gestión de tareas por sprint
- GitHub — control de versiones y colaboración
- Notion — documentación y planificación del equipo
- Visual Studio Code — desarrollo de la aplicación
- Postman — pruebas de endpoints durante el desarrollo

---

# Seguridad

El sistema implementa:

- JWT Authentication con expiración configurable
- Hash de contraseñas con bcrypt
- Protección de rutas privadas por rol
- Validación de datos de entrada
- Manejo de errores centralizado
- Middlewares de autenticación y autorización
- Rate limiting en todos los servicios Node.js
- Headers de seguridad con Helmet

---

# Endpoints Principales

## Base URLs

| Servicio | URL Base |
|---|---|
| Auth Service | `http://localhost:3006/feelWell/v1` |
| Healthy Service | `http://localhost:3008/healthyService/v1` |
| Daily Positive Service | `http://localhost:5001` |
| Mood Tracking Service | `http://localhost:3001/feelweell/v1` |

---

## Auth Service

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Estado del servicio | — |
| POST | `/auth` | Registrar nuevo usuario | — |
| GET | `/auth/activate/:token` | Activar cuenta por email | — |
| POST | `/auth/login` | Iniciar sesión | — |
| POST | `/auth/forgot-password` | Solicitar recuperación de contraseña | — |
| POST | `/auth/reset-password/:token` | Restablecer contraseña con token | — |
| PUT | `/auth/change-password` | Cambiar contraseña | Token |

---

## Ejemplos de request

**Registrar usuario** — `POST /auth/`

```json
{
  "firstName": "Ana",
  "surname": "García",
  "email": "ana@ejemplo.com",
  "phone": "50212345678",
  "username": "anagarcia",
  "password": "MiPassword123"
}
```

Tras el registro se envía un correo de activación. La cuenta no puede iniciar sesión hasta ser activada.

**Login** — `POST /auth/login`

```json
{
  "username": "anagarcia",
  "password": "MiPassword123"
}
```

Respuesta exitosa incluye el objeto `user`, el `token` JWT y un `dailyMessage` proveniente del daily-service (si está disponible).

**Cambiar contraseña** — `PUT /auth/change-password`

```json
{
  "currentPassword": "MiPassword123",
  "newPassword": "NuevoPassword456"
}
```

**Recuperar contraseña** — `POST /auth/forgot-password`

```json
{
  "email": "ana@ejemplo.com"
}
```

**Restablecer contraseña** — `POST /auth/reset-password/:token`

```json
{
  "newPassword": "NuevoPassword456"
}
```

---

## Autenticación

El token JWT se envía en el header de los endpoints protegidos:

```
x-token: <token>
// o bien
Authorization: Bearer <token>
```

El token expira en `1h` por defecto (configurable con `JWT_EXPIRES_IN`).

---

## Roles

| Rol | Descripción |
|-----|-------------|
| `USER_ROLE` | Usuario estándar de la plataforma |
| `ADMIN_ROLE` | Administrador principal |
| `ADMIN_USERS_ROLE` | Administrador de usuarios |
| `ADMIN_MOODTRACKING_ROLE` | Administrador de seguimiento de estado de ánimo |
| `ADMIN_HEALTHY_ROLE` | Administrador del módulo de ejercicios y contenidos |

---

## Seeder de administradores

Al iniciar el servidor se crean automáticamente los siguientes usuarios si no existen:

| Username | Email | Rol |
|----------|-------|-----|
| `admin` | admin@feelwell.com | `ADMIN_ROLE` |
| `admin-users` | admin.users@feelwell.com | `ADMIN_USERS_ROLE` |
| `admin-mood` | admin.mood@feelwell.com | `ADMIN_MOODTRACKING_ROLE` |
| `admin-healthy` | admin.healthy@feelwell.com | `ADMIN_HEALTHY_ROLE` |

---

## Notas

- Las cuentas nuevas se crean con `isActive: false` y requieren activación por correo antes de poder hacer login.
- El login intenta obtener un mensaje diario del `daily-service` en `localhost:5001`. Si ese servicio no está disponible, el login igual responde con éxito.

## Mood Tracking Service

### Mood Entries

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/moodTracking/mood` | Registrar emoción del día | Token |
| GET | `/moodTracking/mood/today` | Obtener registro de hoy | Token |
| GET | `/moodTracking/mood/history` | Obtener historial emocional | Token |
| GET | `/moodTracking/questionnaire` | Obtener cuestionario inicial | Token |
| POST | `/moodTracking/questionnaire` | Enviar respuestas del cuestionario | Token |
| GET | `/moodTracking/profile` | Obtener perfil emocional del usuario | Token |
| POST | `/moodTracking/events/publish` | Publicar eventos de ánimo (RabbitMQ) | Token |

### Streaks

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/streak` | Obtener racha actual del usuario | Token |
| PUT | `/streak` | Actualizar racha | Token |
| GET | `/streak/at-risk` | Verificar si la racha está en riesgo | Token |

### Administración (rol `admin-MoodTracking`)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/admin/mood-entries` | Listar todas las entradas de mood | admin-MoodTracking |
| DELETE | `/admin/mood-entries/:id` | Eliminar una entrada de mood | admin-MoodTracking |
| GET | `/admin/streaks` | Listar rachas de todos los usuarios | admin-MoodTracking |
| PUT | `/admin/streaks/:userId/reset` | Resetear racha de un usuario | admin-MoodTracking |
| GET | `/admin/profiles` | Listar todos los perfiles | admin-MoodTracking |
| DELETE | `/admin/profiles/:userId` | Eliminar perfil de un usuario | admin-MoodTracking |
| GET | `/admin/stats` | Obtener estadísticas del sistema | admin-MoodTracking |

```json
// Registrar emoción
{
  "emotion": "feliz",
  "intensity": 4,
  "note": "Tuve un buen día en clase",
  "date": "2026-03-06"
}
```

Estados de emoción disponibles:
```
feliz | tranquilo | triste | ansioso | enojado | estresado | motivado
```

---

## Exercises (Healthy Service)

## Endpoints

### Exercises `/healthyService/v1/exercises`

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/exercises/` | Listar todos los ejercicios | Token |
| GET | `/exercises/recommended` | Ejercicios recomendados según perfil | Token |
| GET | `/exercises/user/progress` | Ver progreso del usuario | USER_ROLE |
| GET | `/exercises/:id` | Ver detalle de un ejercicio | Token |
| POST | `/exercises/` | Crear nuevo ejercicio (con foto) | ADMIN_HEALTHY_ROLE |
| PUT | `/exercises/:id` | Actualizar ejercicio | ADMIN_HEALTHY_ROLE |
| DELETE | `/exercises/:id` | Eliminar ejercicio | ADMIN_HEALTHY_ROLE |
| POST | `/exercises/:id/photo` | Subir o reemplazar foto | ADMIN_HEALTHY_ROLE |
| DELETE | `/exercises/:id/photo` | Eliminar foto del ejercicio | ADMIN_HEALTHY_ROLE |
| POST | `/exercises/:exerciseId/complete` | Marcar ejercicio como completado | USER_ROLE |
| POST | `/exercises/:exerciseId/save` | Guardar ejercicio para después | USER_ROLE |

**Crear ejercicio** — `POST /exercises/`

```json
{
  "title": "Respiración 4-7-8",
  "description": "Técnica de respiración para reducir la ansiedad",
  "type": "RESPIRACIÓN",
  "targetProfile": "ANSIOSO",
  "duration": 5,
  "instructions": "Inhala 4 seg, mantén 7 seg, exhala 8 seg"
}
```

Tipos de ejercicio: `RESPIRACIÓN | MEDITACIÓN | YOGA | RELAJACIÓN | MINDFULNESS | ESTIRAMIENTO`

Perfiles objetivo: `EQUILIBRADO | RESILIENTE | ANSIOSO | DEPRESIVO`

La foto se envía como `multipart/form-data` con el campo `photo`.

---

### Contents `/healthyService/v1/contents`

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/contents/` | Listar todo el contenido educativo | Token |
| GET | `/contents/category/:category` | Filtrar por categoría | Token |
| GET | `/contents/:id` | Ver detalle de un recurso | Token |
| POST | `/contents/` | Crear nuevo recurso (con foto) | ADMIN_HEALTHY_ROLE |
| PUT | `/contents/:id` | Actualizar recurso | ADMIN_HEALTHY_ROLE |
| DELETE | `/contents/:id` | Eliminar recurso | ADMIN_HEALTHY_ROLE |

**Crear contenido** — `POST /contents/`

```json
{
  "title": "Cómo manejar el estrés académico",
  "description": "Guía práctica para estudiantes",
  "type": "ARTÍCULO",
  "category": "ESTRÉS",
  "url": "https://ejemplo.com/articulo",
  "body": "Contenido completo del artículo..."
}
```

Tipos: `VIDEO | ARTÍCULO | RECURSO`

Categorías: `ESTRÉS | DEPRESIÓN | DESARROLLO PERSONAL | ANSIEDAD | BIENESTAR GENERAL`

La foto se envía como `multipart/form-data` con el campo `photo`.

---

## Notas

- El borrado de ejercicios y contenidos es lógico (`isDeleted: true`). Las consultas de contenido excluyen automáticamente los registros eliminados.
- Las imágenes se almacenan en Cloudinary. Al crear ejercicios o contenidos con foto, el request debe enviarse como `multipart/form-data`.
- El token JWT se acepta tanto en el header `x-token` como en `Authorization: Bearer <token>`.


## Notifications (Healthy Service)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/notifications/my` | Obtener todas las notificaciones del usuario | Token |
| GET | `/notifications/preferences` | Ver preferencias de notificaciones | Token |
| PUT | `/notifications/preferences` | Actualizar preferencias de notificaciones | Token |
| PATCH | `/notifications/preferences/toggle` | Activar/desactivar un tipo de notificación | Token |
| PATCH | `/notifications/:id/read` | Marcar notificación como leída | Token |
| POST | `/notifications/log` | Registrar log de notificación | Token |
| POST | `/notifications/schedule/mood-reminder` | Programar recordatorio de estado de ánimo | Token |
| POST | `/notifications/schedule/streak-alert` | Enviar alerta de racha en riesgo | Token |
| POST | `/notifications/schedule/exercise-reminder` | Enviar recordatorio de ejercicio pendiente | Token |

```json
// Alerta de racha en riesgo (POST /notifications/schedule/streak-alert)
{
  "userId": "id_del_usuario",
  "currentStreak": 5
}

// Recordatorio de ejercicio (POST /notifications/schedule/exercise-reminder)
{
  "userId": "id_del_usuario",
  "exerciseId": "id_del_ejercicio",
  "exerciseTitle": "Respiración 4-7-8"
}
```

Tipos de notificación:
```
streak_alert | exercise_reminder | mood_reminder | motivational | general
```

---

## Daily Positive Service (.NET)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/feelWell/v1/health` | Estado del servicio | — |
| GET | `/api/daily-message/today/:userId` | Obtener mensaje motivador del día para el usuario | Token |
| GET | `/api/admin/messages` | Listar todos los mensajes motivadores | ADMIN_ROLE |
| GET | `/api/admin/messages/active` | Listar mensajes activos | ADMIN_ROLE |
| GET | `/api/admin/messages/:userId` | Ver mensajes de un usuario específico | ADMIN_ROLE |
| POST | `/api/admin/messages` | Crear nuevo mensaje motivador | ADMIN_ROLE |
| PATCH | `/api/admin/messages/:id` | Actualizar mensaje motivador | ADMIN_ROLE |
| DELETE | `/api/admin/messages/:id` | Eliminar mensaje motivador | ADMIN_ROLE |

```json
// Respuesta de GET /api/daily-message/today/:userId
{
  "message": "Cada pequeño paso que das hoy es un gran avance hacia tu bienestar.",
  "type": "afirmacion",
  "date": "2026-03-06",
  "alreadySeen": false
}
```

---

# Estructura del Proyecto

```
FEELWELL/
├── auth-service/                  # Servicio de autenticación (Node.js)
│   ├── configs/                   # Configuración del servidor, DB, CORS, Helmet y rate limit
│   ├── helpers/                   # email.helper.js
│   ├── middlewares/               # JWT, roles, validadores y manejo de errores
│   ├── src/                       # user.model.js, user.controller.js, user.services.js, user.routes.js
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── healthy-service/               # Servicio de bienestar (Node.js)
│   ├── configs/                   # Configuración del servidor, DB, CORS, Helmet y rate limit
│   ├── helpers/                   # cloudinary-service.js
│   ├── middlewares/               # JWT, roles, validadores, file-uploader y manejo de errores
│   ├── src/
│   │   ├── contents/              # content.model.js, content.controller.js, content.services.js, content.routes.js
│   │   ├── exercises/             # exercise.model.js, exercise.controller.js, exercise.services.js, exercise.routes.js, userProgress.model.js
│   │   └── notifications/         # notification.model.js, notification.controller.js, notification.service.js, notification.route.js, notificationPreferences.model.js
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── daily-positive-service/        # Servicio de refuerzo positivo (.NET 8)
│   ├── src/
│   │   ├── DailyPositive.Api/          # Controllers/, Middlewares/, Properties/
│   │   │   ├── appsettings.json        # Configuración de MongoDB, JWT y Serilog
│   │   │   ├── appsettings.Development.json
│   │   │   └── Program.cs
│   │   ├── DailyPositive.Application/  # DTOs/, Interfaces/, Services/
│   │   ├── DailyPositive.Domain/       # Entities/, Interfaces/
│   │   └── DailyPositive.Persistence/  # Config/, Data/, Repositories/
│   ├── DailyPositiveService.sln
│   └── global.json
│
└── mood-tracking/                 # Servicio de seguimiento del estado de ánimo (Node.js)
    ├── configs/                   # app.js, db.configuration.js, cors.configuration.js,
    │                              # helmet.configuration.js, rateLimit.configuration.js
    ├── middlewares/               # validate-JWT.js, validate-role.js, mood-validator.js,
    │                              # tracking-validator.js, check-validator.js, handle-errors.js
    ├── src/
    │   └── mood-tracking/
    │       ├── mood.controller.js
    │       ├── mood.service.js
    │       ├── mood.route.js
    │       ├── moodEntry.model.js
    │       ├── questionnaireResponse.model.js
    │       ├── streak.controller.js
    │       ├── streak.service.js
    │       ├── streak.route.js
    │       ├── streak.model.js
    │       ├── admin.controller.js
    │       ├── admin.service.js
    │       ├── admin.router.js
    │       └── rabbitmq.service.js
    ├── .env
    ├── generate-token.js
    ├── index.js
    ├── package.json
    └── pnpm-lock.yaml
```

---

# Instalación

## Requisitos

- Node.js 18+
- pnpm
- MongoDB
- RabbitMQ (para Mood Tracking Service)
- .NET 8 SDK

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/jzeta-2021001/FeelWeell.git
cd FeelWell
```

## 2. Instalar dependencias de los servicios Node.js

```bash
# Auth Service
cd auth-service
pnpm install

# Healthy Service
cd ../healthy-service
pnpm install

# Mood Tracking Service
cd ../mood-tracking
pnpm install
```

## 3. Configurar variables de entorno

Crear el archivo `.env` en cada servicio Node.js con las variables indicadas.

### auth-service/.env
```env
PORT=3006

URI_MONGODB=mongodb://localhost:27017/feel-well

JWT_SECRET=tu_secreto_aqui
JWT_ISSUER=feelWell
JWT_AUDIENCE=feelWell
JWT_EXPIRES_IN=1h

EMAIL_PROVIDER=gmail
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_app_password
FRONTEND_URL=http://localhost:3006/feelWell/v1/auth
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### healthy-service/.env
```env
PORT=3008

URI_MONGODB=mongodb://localhost:27017/feel-well

JWT_SECRET=tu_secreto_aqui
JWT_ISSUER=feelWell
JWT_AUDIENCE=feelWell
JWT_EXPIRES_IN=1h

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_BASE_FOLDER=https://res.cloudinary.com/tu_cloud_name/image/upload/feel_well
CLOUDINARY_DEFAULT_AVATAR_NAME=nombre_avatar_default

NODE_TLS_REJECT_UNAUTHORIZED=0
```

### mood-tracking/.env
```env
PORT=3001

URI_MONGODB=mongodb://localhost:27017/feel-well

JWT_SECRET=tu_secreto_aqui
JWT_ISSUER=feelWell
JWT_AUDIENCE=feelWell
JWT_EXPIRES_IN=1h

RABBITMQ_URL=amqp://localhost
```

### daily-positive-service — appsettings.json

El archivo se encuentra en `daily-positive-service/src/DailyPositive.Api/appsettings.json`:

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "feel-well"
  },
  "JwtSettings": {
    "Secret": "tu_secreto_aqui",
    "Issuer": "feelWell",
    "Audience": "feelWell"
  },
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Microsoft.AspNetCore": "Warning"
      }
    },
    "WriteTo": [
      { "Name": "Console" }
    ]
  },
  "AllowedHosts": "*"
}
```

> **Importante**: El `JWT_SECRET` / `JwtSettings.Secret` debe ser el mismo en todos los servicios para que la validación de tokens funcione correctamente entre microservicios.

## 4. Iniciar los servicios

```bash
# Terminal 1 — Auth Service
cd auth-service
pnpm run dev

# Terminal 2 — Healthy Service
cd healthy-service
pnpm run dev

# Terminal 3 — Mood Tracking Service
cd mood-tracking
pnpm run dev

# Terminal 4 — Daily Positive Service (.NET)
cd daily-positive-service
dotnet restore
dotnet run --project src/DailyPositive.Api
```

---

# Colección Postman

La colección Postman con todos los endpoints del sistema se encuentra versionada en el repositorio:

```
FeelWell_postman_collection.json
```

Incluye peticiones organizadas por servicio:

- **Auth-service** — registro, login, activación, recuperación y cambio de contraseña
- **Healthy-service** — ejercicios, contenido educativo y notificaciones
- **MessagePositive-service** — mensajes motivadores diarios (Daily Positive Service)
- **MoodTracking-service** — registro emocional, rachas y administración

### Cómo importar

1. Abrir Postman
2. Seleccionar **Import**
3. Arrastrar el archivo `FeelWell_postman_collection.json` o seleccionarlo desde el explorador
4. Configurar las variables de entorno con los tokens y URLs correspondientes

---

# Créditos

Proyecto base desarrollado por:
**Braulio Echeverría**
Curso IN6AM – Kinal Guatemala 2026

Repositorio Original:
https://github.com/IN6AMProm33/auth-service-dotnet.git

**NOTA** 
Este proyecto fue utilizado como referencia académica y posteriormente adaptado y modificado. También se tomó como referencia información que viene de las siguientes fuentes:

- Auth0. (2024). **node-jsonwebtoken**.  
  https://github.com/auth0/node-jsonwebtoken

- express-validator. (2024). **express-validator documentation**.  
  https://express-validator.github.io/docs/

- Auth0. (2024). [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

- express-validator. (2024). [express-validator documentation](https://express-validator.github.io/docs/)

- Axios. (2024). [Axios Documentation](https://axios-http.com/docs/intro)

---