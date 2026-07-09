# FeelWell - Plataforma de Apoyo Emocional

> **Nota**: Este proyecto está basado en un trabajo con nombre "Kinal Sports" desarrollado por Braulio Echeverría para el curso IN6AM - Kinal Guatemala. Se realizaron modificaciones con fines académicos. Forma parte de una arquitectura de microservicios diseñada para brindar acompañamiento emocional y seguimiento del bienestar personal mediante tecnologías modernas como Node.js, React, MongoDB, RabbitMQ y C# con .NET.

**Nota**:
Link de Tablero de Trello:
(https://trello.com/invite/b/699c57c38a10fa0ded5e8712/ATTI5d93119ee8c5088bcf8bcdc41dff845c2111CB8C/problema-social)

Link de documento de Evidencia del Trabajo y Participación del Grupo:
https://cetkinal-my.sharepoint.com/:b:/g/personal/jzeta-2021001_kinal_edu_gt/IQDjC6HJ2556SY93PWHW03-FAVN2D3dlON7cL8fN5hUA3PI?e=UGWghK

Link de Reunión de Retrospectiva SCRUM:
https://teams.microsoft.com/l/meetingrecap?driveId=b%21nc5gst8WakC5wzP0JwvKZyc_9EavZQFElLhzdE3PDT6n0YIvVgZtR6m70X5RBf5h&driveItemId=01FF42JWJIFHHEU6SV7NAKEBJUIYZMNYX3&sitePath=https%3A%2F%2Fcetkinal-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fjzeta-2021001_kinal_edu_gt%2FIQAoKc5KelX7QKIFNEYyxuL7AYrHgfyh5X540Ti4TzH_gL4&fileUrl=https%3A%2F%2Fcetkinal-my.sharepoint.com%2Fpersonal%2Fjzeta-2021001_kinal_edu_gt%2FDocuments%2FRecordings%2FReuni%C3%B3n+en+DebuggersIN6AM-20260306_213951-Grabaci%C3%B3n+de+la+reuni%C3%B3n.mp4%3Fweb%3D1&threadId=19%3A470e8b5d06164b0d9ea0931c8784b3db%40thread.v2&organizerId=268cc993-5c26-4bd0-9c7b-267e2243c1a7&tenantId=5545b48f-b22f-4bbb-bba5-7f5040667180&callId=e9f8adaf-6683-445d-ab13-620bcb7cb600&threadType=GroupChat&meetingType=Adhoc&subType=RecapSharingLink_RecapCore

---

# Descripción

**FeelWell** es una plataforma de apoyo emocional diseñada para acompañar a los usuarios en su bienestar psicológico y mental. La aplicación proporciona ejercicios, contenido educativo, seguimiento del estado de ánimo, refuerzo positivo diario y un asistente conversacional de IA, promoviendo hábitos saludables sin reemplazar a los especialistas, sino siendo una herramienta de acompañamiento constante.

La plataforma está orientada a jóvenes y personas que enfrentan situaciones de estrés académico, laboral o personal, y necesitan un espacio accesible para el cuidado de su salud mental.

El sistema está basado en una arquitectura de microservicios, donde cada servicio es responsable de una funcionalidad específica, permitiendo mayor escalabilidad, mantenibilidad y seguridad. Todos los servicios se integran mediante un cliente web (React) que consume cada API por separado.

Actualmente, el sistema cuenta con los siguientes componentes:

- **Auth Service** (Node.js) — autenticación, usuarios y roles
- **Healthy Service** (Node.js) — ejercicios, contenido educativo, retos diarios y notificaciones
- **Daily Positive Service** (.NET 8) — mensajes motivacionales diarios
- **Mood Tracking Service** (Node.js) — seguimiento del estado de ánimo y rachas, con mensajería RabbitMQ
- **AI Chat Service** (Node.js) — "Tiyú", asistente de apoyo emocional con IA
- **Client Admin** (React + Vite) — cliente web para usuarios y administradores

---

# Arquitectura General

El sistema implementa una arquitectura basada en microservicios, donde cada servicio Node.js se organiza en las siguientes capas:

- **configs**: Configuración del servidor, base de datos, CORS, Helmet, rate limiting y Swagger
- **middlewares**: Validaciones, autenticación JWT, manejo de roles y errores
- **helpers**: Utilidades del servicio (correo, Cloudinary, etc.)
- **src**: Modelos, controladores, servicios y rutas de cada dominio

El servicio en .NET (Daily Positive) sigue Clean Architecture, separado en Api, Application, Domain y Persistence.

El cliente (`client-admin`) sigue una organización por *features* (auth, chat, contents, dashboard, exercises, mood, notifications, users), cada una con sus propios componentes, hooks, páginas y stores de Zustand, más una capa `shared` para componentes, utilidades y clientes Axios reutilizables.

Esta arquitectura permite mantener una separación clara de responsabilidades, facilitando el mantenimiento y crecimiento del sistema.

---

# Auth Service

## Descripción

El Auth Service es el encargado de gestionar la autenticación, autorización y administración de usuarios dentro de la plataforma FeelWell. Es el núcleo de seguridad del sistema: valida la identidad de los usuarios y protege los endpoints de los demás microservicios mediante JWT.

## Funcionalidades Principales

### Autenticación

- Registro de nuevos usuarios en la plataforma
- Activación de cuenta mediante enlace enviado por correo (las cuentas nuevas inician con `isActive: false`)
- Inicio de sesión mediante usuario y contraseña
- Recuperación y restablecimiento de contraseña vía token enviado por correo
- Cambio de contraseña autenticado
- Generación de tokens JWT firmados
- Seeder automático de usuarios administradores al levantar el servicio (ver sección de Roles)

### Autorización

El sistema maneja los siguientes roles:

- `ADMIN_ROLE` — administrador principal
- `ADMIN_USERS_ROLE` — administrador de usuarios
- `ADMIN_MOODTRACKING_ROLE` — administrador de seguimiento de estado de ánimo
- `ADMIN_HEALTHY_ROLE` — administrador de ejercicios y contenidos
- `USER_ROLE` — usuario estándar (asignado automáticamente al registrarse)

### Seguridad

- Encriptación de contraseñas con `@node-rs/bcrypt`
- Generación y validación de tokens JWT en cada solicitud protegida
- Envío de correos transaccionales con Nodemailer
- Documentación interactiva vía Swagger en `/api-docs`

### Arquitectura del Servicio

- **configs**: Configuración del servidor, base de datos, CORS, Helmet, rate limit y Swagger
- **helpers**: Utilidades del servicio (email helper)
- **middlewares**: JWT, roles y validadores
- **src**: Controladores, rutas y lógica de usuarios

---

# Healthy Service

## Descripción

El Healthy Service gestiona los ejercicios de bienestar, el contenido educativo, los retos diarios y el sistema de notificaciones y recordatorios de la plataforma FeelWell. Funciona en conjunto con el Auth Service para validar la identidad y permisos de los usuarios.

## Funcionalidades Principales

### Ejercicios y Retos de Bienestar

- Catálogo de ejercicios de relajación y motivación, con tipo, duración e instrucciones
- Recomendación de ejercicios según perfil emocional del usuario
- Seguimiento de progreso del usuario (ejercicios completados y guardados para después)
- **Reto diario**: selecciona de forma determinista un mismo ejercicio para todos los usuarios durante el día (según fecha), filtrando por estado de ánimo cuando es posible
- Subida de imágenes mediante Cloudinary

### Contenido Educativo

- Material educativo (videos, artículos, recursos), filtrable por categoría
- Contenido relacionado con manejo de estrés, depresión, ansiedad, desarrollo personal y bienestar general
- Subida de imágenes mediante Cloudinary
- Borrado lógico (`isDeleted`), excluido automáticamente de las consultas

### Notificaciones y Recordatorios

- Consulta y lectura de notificaciones del usuario autenticado
- Preferencias configurables por usuario: hora de recordatorio, activación de notificaciones push (token FCM) y tipos de notificación activos
- Validación anti-spam: no se crea una nueva notificación del mismo tipo si ya existe una en las últimas 24 horas (`skipped: true`)
- Tipos de notificación: `MOOD_REMINDER`, `EXERCISE_REMINDER`, `STREAK_ALERT`
- Endpoints para programar recordatorios de estado de ánimo, ejercicios pendientes y alertas de racha en riesgo

### Seguridad

- Protección de endpoints mediante JWT
- Validación de identidad del usuario autenticado
- Restricción de acceso según rol (`ADMIN_HEALTHY_ROLE`, `USER_ROLE`)
- Documentación interactiva vía Swagger en `/feelWeell/v1/api-docs`

### Arquitectura del Servicio

- **configs**: Configuración del servidor, base de datos, CORS, Helmet, rate limit y Swagger
- **helpers**: Utilidades del servicio (Cloudinary)
- **middlewares**: JWT, roles, validadores y manejo de archivos
- **src/contents**: Gestión de contenido educativo y recursos
- **src/exercises**: Ejercicios, progreso de usuario y reto diario
- **src/notifications**: Notificaciones, preferencias y recordatorios programados

---

# Daily Positive Service

## Descripción

El Daily Positive Service es un microservicio construido en **.NET 8** encargado de gestionar el módulo de refuerzo positivo diario de la plataforma FeelWell.

Este servicio recibe al usuario con un mensaje motivador en su primer acceso del día. Si el usuario ya recibió un mensaje ese día, se le devuelve el mismo (idempotencia diaria); si es su primera consulta, se le asigna uno nuevo aleatoriamente entre los mensajes activos.

## Funcionalidades Principales

- Generación y asignación de mensajes motivadores diarios por usuario (`isNewAssignment` indica si el mensaje es nuevo o ya existía)
- CRUD administrativo de mensajes motivacionales (crear, listar todos, listar activos, ver por id, actualizar parcialmente)
- Borrado lógico de mensajes (soft delete mediante `IsActive: false`), preservando el orden de rotación
- Endpoint de salud del servicio

### Arquitectura del Servicio

El servicio sigue una arquitectura limpia en capas:

- **DailyPositive.Api**: Controladores, middlewares, `appsettings.json` y `Program.cs`
- **DailyPositive.Application**: DTOs, interfaces y servicios de aplicación
- **DailyPositive.Domain**: Entidades e interfaces del dominio
- **DailyPositive.Persistence**: Repositorios, contexto de MongoDB y configuración de datos
- **global.json**: Versión fijada del SDK de .NET
- **DailyPositiveService.sln**: Solución de Visual Studio

---

# Mood Tracking Service

## Descripción

El Mood Tracking Service es el microservicio dedicado al registro, análisis y seguimiento del estado de ánimo del usuario. Gestiona el historial emocional, las rachas de uso continuo y el cuestionario de evaluación inicial, con integración a RabbitMQ para comunicación entre servicios.

## Funcionalidades Principales

### Seguimiento del Estado de Ánimo

- Registro diario de emociones con nivel de intensidad y notas
- Amplio catálogo de emociones disponibles (más de 30 estados como `FELIZ`, `TRISTE`, `ANSIOSO`, `CALMADO`, `ABRUMADO`, `ESPERANZADO`, entre otros)
- Consulta del registro del día y del historial completo
- Cuestionario inicial de evaluación psicológica y perfil emocional del usuario

### Rachas (Streaks)

- Consulta de la racha actual del usuario
- Actualización de la racha
- Verificación de si la racha está en riesgo de perderse

### Administración (rol `admin-MoodTracking`)

- Listado y eliminación de entradas de mood
- Listado y reseteo de rachas de usuarios
- Listado y reseteo de perfiles emocionales de usuarios
- Estadísticas generales del sistema

### Mensajería

- Publicación de eventos hacia RabbitMQ (`rabbitmq.service.js`) mediante el exchange configurado en `RABBITMQ_EXCHANGE`, con manejo de reconexión y dead-letter exchange (`RABBITMQ_DLX`)

### Seguridad

- Protección de endpoints mediante JWT
- Validación de identidad del usuario autenticado
- Rol específico `admin-MoodTracking` para rutas administrativas
- Documentación interactiva vía Swagger en `/feelWeell/v1/api-docs`

### Arquitectura del Servicio

- **configs**: `app.js`, `db.configuration.js`, `cors.configuration.js`, `helmet.configuration.js`, `rateLimit.configuration.js`
- **middlewares**: `validate-JWT.js`, `validate-role.js`, `mood-validator.js`, `tracking-validator.js`, `check-validator.js`, `handle-errors.js`
- **src/mood-tracking/mood**: Controlador, servicio, rutas y modelos de registros emocionales y cuestionario
- **src/mood-tracking/streak**: Controlador, servicio, rutas y modelo de rachas
- **src/mood-tracking/admin**: Controlador, servicio y rutas administrativas
- **infrastructure/messaging** y **rabbitmq.service.js**: Publicación de eventos vía RabbitMQ

---

# AI Chat Service — "Tiyú"

## Descripción

El AI Chat Service es el microservicio que da vida a **Tiyú**, el asistente conversacional de apoyo emocional de FeelWell. Está construido en Node.js e integra un modelo de lenguaje (`llama-3.1-8b-instant`, servido a través de la API compatible con OpenAI de **Groq**) para mantener conversaciones empáticas con los usuarios.

## Funcionalidades Principales

### Conversación con IA

- Envío de mensajes al asistente Tiyú mediante un único endpoint autenticado
- Historial de conversación persistido en MongoDB por usuario (hasta 50 mensajes, con expiración automática a los 30 días mediante índice TTL)
- Prompt de sistema que define la personalidad de Tiyú: cálido, empático y enfocado exclusivamente en apoyo emocional, adaptando el lenguaje según la edad de quien escribe

### Guardas de Alcance y Seguridad

- **Detección de temas fuera de alcance**: filtra preguntas sobre tareas escolares, programación, clima, noticias, deportes, recetas, temas legales/médicos/financieros, entre otros, respondiendo con un mensaje de redirección hacia el apoyo emocional en vez de procesarlas con la IA
- **Detección de crisis**: analiza cada mensaje en busca de palabras clave de riesgo (ideación suicida, autolesión). Si detecta una crisis:
  - Guarda una alerta en la base de datos (`CrisisAlert`) con el mensaje, las palabras clave detectadas y la respuesta entregada
  - Responde inmediatamente con un mensaje de contención y datos de líneas de ayuda (ej. 110 en Guatemala), sin enviar el mensaje a la IA
- El campo `tipo` de la respuesta indica el origen: `RESPUESTA` (respuesta normal de la IA), `EMERGENCIA` (crisis detectada) o `BLOQUEADO` (contenido bloqueado por los filtros de seguridad del modelo)

### Seguridad

- Protección del endpoint mediante JWT
- Validación del mensaje de entrada (requerido, tipo texto, entre 1 y 2000 caracteres)
- Documentación interactiva vía Swagger en `/feelWeell/v1/api-docs`

### Arquitectura del Servicio

- **configs**: Configuración del servidor, base de datos, CORS, Helmet, rate limit, integración con la IA (`ai.configuration.js`) y Swagger
- **middlewares**: JWT, validador de mensajes, guarda de temas fuera de alcance y detector de crisis
- **src/chat**: Controlador, servicio, rutas y modelo de conversación
- **src/crisis**: Modelo y servicio de alertas de crisis

---

# Client Admin (Frontend)

## Descripción

`client-admin` es la aplicación web construida con **React 19 + Vite** que consume los cinco microservicios anteriores. A pesar de su nombre, no es exclusivamente un panel administrativo: sirve tanto a usuarios finales (`USER_ROLE`) como a los distintos roles administrativos, mostrando distintas vistas según el rol autenticado.

## Funcionalidades Principales

### Vista de Usuario (`/home`)

- Autenticación (login, registro, activación de cuenta, recuperación y cambio de contraseña)
- Chat con Tiyú, el asistente de IA, incluyendo indicador de escritura, sugerencias de conversación y aviso de emergencia ante respuestas de crisis
- Catálogo de ejercicios de bienestar con filtros, guardado, marcado como completado y estadísticas de progreso
- Widget de reto diario
- Catálogo de contenido educativo con filtros por categoría
- Registro y consulta de estado de ánimo, incluyendo el cuestionario inicial
- Centro de notificaciones: campana con contador de no leídas, listado, marcado como leído y preferencias configurables (frecuencia de recordatorios, tipos activos)

### Vista de Administrador (`/dashboard`)

Acceso restringido por rol mediante `RoleGuard`, con las siguientes secciones:

- Gestión de usuarios (`ADMIN_ROLE`, `ADMIN_USERS_ROLE`)
- Gestión de ejercicios y retos diarios (`ADMIN_ROLE`, `ADMIN_HEALTHY_ROLE`)
- Gestión de contenido educativo (`ADMIN_ROLE`, `ADMIN_HEALTHY_ROLE`)
- Gestión de mensajes motivacionales (`ADMIN_ROLE`, `ADMIN_MOODTRACKING_ROLE`)
- Panel de seguimiento de estado de ánimo (`ADMIN_ROLE`, `ADMIN_MOODTRACKING_ROLE`)
- Cambio de contraseña

### Organización del Código

- **src/app**: Layouts (`DashboardPage`, `UserLayout`), rutas (`AppRoutes`, `ProtectedRoutes`, `RoleGuard`) y punto de entrada (`main.jsx`, `App.jsx`)
- **src/features**: Un módulo por dominio (`auth`, `chat`, `contents`, `dashboard`, `exercises`, `mood`, `notifications`, `users`), cada uno con sus componentes, hooks, páginas y store de Zustand
- **src/shared/apis**: Clientes Axios por servicio (`auth`, `chat`, `content`, `exercise`, `mood`, `motivational`, `notifications`, `streak`, `users`)
- **src/shared/components**: Componentes reutilizables (layouts, avatar, mascota de Tiyú)
- **src/shared/utils**: Utilidades (manejo de mensajes de error, notificaciones toast)

### Stack del Frontend

- React 19 + Vite
- Zustand para manejo de estado
- React Router DOM v7
- React Hook Form para formularios
- Axios para consumo de APIs
- Tailwind CSS v4 + Material Tailwind
- React Hot Toast para notificaciones visuales
- Lucide React y Heroicons para iconografía
- Three.js (usado en la mascota/animaciones de Tiyú)

---

# Tecnologías Utilizadas

## Backend

- Node.js con Express (Auth, Healthy, Mood Tracking, AI Chat)
- C# con .NET 8 (Daily Positive Service)
- Arquitectura de microservicios
- RabbitMQ (mensajería entre servicios, usada en Mood Tracking)
- OpenAI SDK contra la API de Groq (modelo `llama-3.1-8b-instant`) para el servicio de IA

## Base de Datos

### MongoDB

Utilizado en:

- Usuarios y autenticación (Auth Service) — base `feel-well`
- Ejercicios, contenido y notificaciones (Healthy Service) — base `feel-well`
- Mensajes motivadores diarios (Daily Positive Service) — base `feel-well`
- Registros emocionales y rachas (Mood Tracking Service) — base `feel-well`
- Conversaciones y alertas de crisis (AI Chat Service) — base `feel-well-ai`

Tecnología: Mongoose ODM (Node.js) / MongoDB.Driver (C# .NET)

## Almacenamiento de Archivos

- Cloudinary — para imágenes de ejercicios y contenido (Healthy Service)

## Seguridad

- JWT Authentication (`jsonwebtoken` / Microsoft.AspNetCore.Authentication.JwtBearer)
- Hash de contraseñas con `@node-rs/bcrypt`
- Validación de datos con `express-validator`
- Helmet y rate limiting en todos los servicios Node.js
- Documentación de APIs con Swagger (`swagger-jsdoc` + `swagger-ui-express`) en cada servicio Node.js

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
- Hash de contraseñas con `@node-rs/bcrypt`
- Protección de rutas privadas por rol
- Validación de datos de entrada
- Manejo de errores centralizado
- Middlewares de autenticación y autorización
- Rate limiting en todos los servicios Node.js
- Headers de seguridad con Helmet
- Detección de mensajes de crisis y filtrado de temas fuera de alcance en el servicio de IA

---

# Endpoints Principales

## Base URLs

| Servicio | URL Base | Documentación Swagger |
|---|---|---|
| Auth Service | `http://localhost:3006/feelWeell/v1` | `http://localhost:3006/api-docs` |
| Healthy Service | `http://localhost:3008/feelWeell/v1` | `http://localhost:3008/feelWeell/v1/api-docs` |
| Mood Tracking Service | `http://localhost:3001/feelWeell/v1` | `http://localhost:3001/feelWeell/v1/api-docs` |
| AI Chat Service | `http://localhost:3007/feelWeell/v1` | `http://localhost:3007/feelWeell/v1/api-docs` |
| Daily Positive Service | `http://localhost:5001` | vía Swagger de .NET (`/swagger`) |

> **Nota**: el prefijo de ruta usado en el código de los servicios Node.js es `/feelWeell/v1` (con doble "e", como el nombre del repositorio).

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

### Ejemplos de request

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

### Autenticación

El token JWT se envía en el header de los endpoints protegidos:

```
Authorization: Bearer <token>
```

El token expira en `1h` por defecto (configurable con `JWT_EXPIRES_IN`).

### Roles

| Rol | Descripción |
|-----|-------------|
| `USER_ROLE` | Usuario estándar de la plataforma |
| `ADMIN_ROLE` | Administrador principal |
| `ADMIN_USERS_ROLE` | Administrador de usuarios |
| `ADMIN_MOODTRACKING_ROLE` | Administrador de seguimiento de estado de ánimo |
| `ADMIN_HEALTHY_ROLE` | Administrador del módulo de ejercicios y contenidos |

### Seeder de administradores

Al iniciar el servidor se crean automáticamente los usuarios administradores definidos en las variables `SEEDER_*` del `.env` (uno por cada rol de administrador) si no existen previamente en la base de datos.

### Notas

- Las cuentas nuevas se crean con `isActive: false` y requieren activación por correo antes de poder hacer login.

---

## Healthy Service — Exercises `/exercises`

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/exercises/` | Listar todos los ejercicios | Token |
| GET | `/exercises/recommended` | Ejercicios recomendados según perfil | Token |
| GET | `/exercises/user/progress` | Ver progreso del usuario | `USER_ROLE` |
| GET | `/exercises/:id` | Ver detalle de un ejercicio | Token |
| POST | `/exercises/` | Crear nuevo ejercicio (con foto) | `ADMIN_HEALTHY_ROLE` |
| PUT | `/exercises/:id` | Actualizar ejercicio | `ADMIN_HEALTHY_ROLE` |
| DELETE | `/exercises/:id` | Eliminar ejercicio | `ADMIN_HEALTHY_ROLE` |
| POST | `/exercises/:id/photo` | Subir o reemplazar foto | `ADMIN_HEALTHY_ROLE` |
| DELETE | `/exercises/:id/photo` | Eliminar foto del ejercicio | `ADMIN_HEALTHY_ROLE` |
| POST | `/exercises/:exerciseId/complete` | Marcar ejercicio como completado | `USER_ROLE` |
| POST | `/exercises/:exerciseId/save` | Guardar ejercicio para después | `USER_ROLE` |
| GET | `/exercises/daily-challenge?mood=` | Obtener el reto diario (opcionalmente filtrado por estado de ánimo) | Token |

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

El reto diario se calcula de forma determinista según la fecha (mismo reto para todos los usuarios en un mismo día), priorizando ejercicios que coincidan con el `mood` recibido; si no hay coincidencias, selecciona entre todos los ejercicios disponibles.

---

## Healthy Service — Contents `/contents`

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/contents/` | Listar todo el contenido educativo | Token |
| GET | `/contents/category/:category` | Filtrar por categoría | Token |
| GET | `/contents/:id` | Ver detalle de un recurso | Token |
| POST | `/contents/` | Crear nuevo recurso (con foto) | `ADMIN_HEALTHY_ROLE` |
| PUT | `/contents/:id` | Actualizar recurso | `ADMIN_HEALTHY_ROLE` |
| DELETE | `/contents/:id` | Eliminar recurso | `ADMIN_HEALTHY_ROLE` |

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

### Notas

- El borrado de ejercicios y contenidos es lógico (`isDeleted: true`). Las consultas de contenido excluyen automáticamente los registros eliminados.
- Las imágenes se almacenan en Cloudinary.
- El token JWT se acepta tanto en el header `x-token` como en `Authorization: Bearer <token>`.

---

## Healthy Service — Notifications `/notifications`

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/notifications/my` | Obtener todas las notificaciones del usuario | Token |
| PATCH | `/notifications/:id/read` | Marcar notificación como leída | Token |
| GET | `/notifications/preferences` | Ver preferencias de notificaciones | Token |
| PUT | `/notifications/preferences` | Actualizar preferencias (`reminderTime`, `fcmToken`, `pushEnabled`) | Token |
| PATCH | `/notifications/preferences/toggle` | Activar/desactivar un tipo de notificación | Token |
| POST | `/notifications/log` | Registrar una notificación (con validación anti-spam de 24h) | Token |
| POST | `/notifications/schedule/mood-reminder` | Programar recordatorio de estado de ánimo | Token |
| POST | `/notifications/schedule/exercise-reminder` | Enviar recordatorio de ejercicio pendiente | Token |
| POST | `/notifications/schedule/streak-alert` | Enviar alerta de racha en riesgo | Token |

```json
// Alerta de racha en riesgo (POST /notifications/schedule/streak-alert)
{
  "currentStreak": 7,
  "lastActivityDate": "2026-05-19T20:00:00.000Z"
}

// Recordatorio de ejercicio (POST /notifications/schedule/exercise-reminder)
{
  "exerciseId": "665b2c3d4e5f6a0023456789",
  "exerciseTitle": "Respiración diafragmática"
}
```

Tipos de notificación: `MOOD_REMINDER | EXERCISE_REMINDER | STREAK_ALERT`

Si ya existe una notificación del mismo tipo para el usuario en las últimas 24 horas, el endpoint responde con `skipped: true` en vez de crear una duplicada.

---

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

```json
// Registrar emoción
{
  "emotion": "FELIZ",
  "intensity": 4,
  "note": "Tuve un buen día en clase",
  "date": "2026-03-06"
}
```

El campo `emotion` acepta un catálogo amplio de más de 30 estados en mayúsculas (`FELIZ`, `TRISTE`, `ENOJADO`, `ANSIOSO`, `CALMADO`, `EMOCIONADO`, `FRUSTRADO`, `NEUTRAL`, `ABRUMADO`, `DESMOTIVADO`, `ESPERANZADO`, entre otros), definidos en el modelo `moodEntry.model.js`.

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
| PUT | `/admin/profiles/:userId/reset` | Resetear perfil emocional de un usuario | admin-MoodTracking |
| GET | `/admin/stats` | Obtener estadísticas del sistema | admin-MoodTracking |

---

## AI Chat Service — Tiyú

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/health` | Estado del servicio | — |
| POST | `/chat` | Enviar un mensaje a Tiyú | Token |

**Enviar mensaje** — `POST /chat`

```json
{
  "mensaje": "Me siento muy agobiado con el trabajo últimamente"
}
```

```json
// Respuesta normal
{
  "success": true,
  "tipo": "RESPUESTA",
  "respuesta": "Entiendo que el trabajo puede ser muy pesado a veces. ¿Quieres contarme más sobre lo que está pasando?"
}
```

El pipeline de procesamiento es: validación JWT → validación del mensaje (1-2000 caracteres) → guarda de tema fuera de alcance → detección de crisis → respuesta de la IA (modelo `llama-3.1-8b-instant` vía Groq).

---

## Daily Positive Service (.NET)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/feelWell/v1/health` | Estado del servicio | — |
| GET | `/api/daily-message/today/:userId` | Obtener mensaje motivador del día para el usuario | — |
| GET | `/api/admin/messages` | Listar todos los mensajes motivadores | `ADMIN_ROLE`, `ADMIN_MOODTRACKING_ROLE` |
| GET | `/api/admin/messages/active` | Listar mensajes activos | `ADMIN_ROLE`, `ADMIN_MOODTRACKING_ROLE` |
| GET | `/api/admin/messages/:id` | Ver un mensaje por su id | `ADMIN_ROLE`, `ADMIN_MOODTRACKING_ROLE` |
| POST | `/api/admin/messages` | Crear nuevo mensaje motivador | `ADMIN_ROLE`, `ADMIN_MOODTRACKING_ROLE` |
| PATCH | `/api/admin/messages/:id` | Actualizar (parcialmente) un mensaje motivador | `ADMIN_ROLE`, `ADMIN_MOODTRACKING_ROLE` |
| DELETE | `/api/admin/messages/:id` | Desactivar mensaje motivador (soft delete) | `ADMIN_ROLE`, `ADMIN_MOODTRACKING_ROLE` |

```json
// Respuesta de GET /api/daily-message/today/:userId
{
  "success": true,
  "message": "Mensaje del día",
  "data": {
    "content": "Cada pequeño paso que das hoy es un gran avance hacia tu bienestar.",
    "isNewAssignment": false
  }
}
```

---

# Estructura del Proyecto

```
FEELWEELL/
├── auth-service/                  # Servicio de autenticación (Node.js)
│   ├── configs/                   # Configuración del servidor, DB, CORS, Helmet, rate limit y Swagger
│   ├── helpers/                   # email.helper.js
│   ├── middlewares/               # JWT, roles, validadores y manejo de errores
│   ├── src/                       # user.model.js, user.controller.js, user.services.js, user.routes.js
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── healthy-service/               # Servicio de bienestar (Node.js)
│   ├── configs/                   # Configuración del servidor, DB, CORS, Helmet, rate limit y Swagger
│   ├── helpers/                   # cloudinary-service.js
│   ├── middlewares/               # JWT, roles, validadores, file-uploader y manejo de errores
│   ├── src/
│   │   ├── contents/              # content.model.js, content.controller.js, content.services.js, content.routes.js
│   │   ├── exercises/             # exercise.model.js, exercise.controller.js/services.js/routes.js,
│   │   │                          # userProgress.model.js, dailyChallenge.controller.js, dailyChallenge.routes.js
│   │   └── notifications/         # notification.model.js, notification.controller.js/service.js/route.js,
│   │                               # notificationPreferences.model.js
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
├── mood-tracking/                 # Servicio de seguimiento del estado de ánimo (Node.js)
│   ├── configs/                   # app.js, db.configuration.js, cors.configuration.js,
│   │                               # helmet.configuration.js, rateLimit.configuration.js
│   ├── middlewares/                # validate-JWT.js, validate-role.js, mood-validator.js,
│   │                                # tracking-validator.js, check-validator.js, handle-errors.js
│   ├── infrastructure/messaging/   # Integración con RabbitMQ
│   ├── src/
│   │   └── mood-tracking/
│   │       ├── mood/               # mood.controller.js, mood.service.js, mood.route.js, moodEntry.model.js
│   │       ├── streak/             # streak.controller.js, streak.service.js, streak.route.js, streak.model.js
│   │       ├── admin/              # admin.controller.js, admin.service.js, admin.router.js
│   │       ├── questionnaireResponse.model.js
│   │       └── rabbitmq.service.js
│   ├── .env
│   ├── generate-token.js
│   ├── index.js
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── ai-chat-service/                # Servicio de IA conversacional "Tiyú" (Node.js)
│   ├── configs/                    # app.js, ai.configuration.js, db.configuration.js, cors/helmet/rateLimit, documentation.js
│   ├── middlewares/                 # validate-JWT.js, chat.validator.js, topic-guard.js, crisis-detector.js, handle-errors.js
│   ├── src/
│   │   ├── chat/                    # chat.controller.js, chat.service.js, chat.routes.js, conversation.model.js
│   │   └── crisis/                  # crisis.model.js, crisis.service.js
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── client-admin/                   # Cliente web (React 19 + Vite)
│   ├── src/
│   │   ├── app/                    # App.jsx, main.jsx, layouts/, routes/ (AppRoutes, ProtectedRoutes, RoleGuard)
│   │   ├── features/
│   │   │   ├── auth/                # Login, registro, activación, recuperación de contraseña
│   │   │   ├── chat/                 # Chat con Tiyú
│   │   │   ├── contents/             # Contenido educativo (vista usuario y admin)
│   │   │   ├── dashboard/            # Páginas del panel administrativo
│   │   │   ├── exercises/            # Ejercicios, retos diarios (vista usuario y admin)
│   │   │   ├── mood/                 # Cuestionario inicial de estado de ánimo
│   │   │   ├── notifications/        # Campana, listado y preferencias de notificaciones
│   │   │   └── users/                # Gestión de usuarios y perfiles
│   │   ├── shared/
│   │   │   ├── apis/                 # Clientes Axios por microservicio
│   │   │   ├── components/           # Layouts y componentes UI reutilizables
│   │   │   └── utils/                # Manejo de errores y notificaciones toast
│   │   ├── assets/img/
│   │   └── style/index.css
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── pg-rabbitmq/
│   └── docker-compose.yml          # Levanta únicamente el contenedor de RabbitMQ
│
├── package.json                    # Scripts raíz para instalar y levantar todos los servicios a la vez
├── pnpm-lock.yaml
├── LICENSE
└── .gitignore
```

---

# Instalación

## Requisitos

- Node.js 18+
- pnpm
- MongoDB
- RabbitMQ (para Mood Tracking Service)
- .NET 8 SDK
- Cuenta de Cloudinary (para Healthy Service)
- API Key de Groq (para AI Chat Service)

## 1. Clonar el repositorio

```bash
git clone https://github.com/jzeta-2021001/FeelWeell.git
cd FeelWeell
```

## 2. Instalar dependencias

El `package.json` de la raíz incluye un script que instala las dependencias de todos los servicios Node.js y del cliente en un solo paso:

```bash
pnpm run install:all
```

Esto ejecuta `pnpm install` en la raíz y luego en `ai-chat-service`, `auth-service`, `client-admin`, `healthy-service` y `mood-tracking`.

También se puede instalar servicio por servicio:

```bash
cd auth-service && pnpm install
cd ../healthy-service && pnpm install
cd ../mood-tracking && pnpm install
cd ../ai-chat-service && pnpm install
cd ../client-admin && pnpm install
```

## 3. Configurar variables de entorno

Crear el archivo `.env` en cada servicio con las variables indicadas (los valores mostrados son de ejemplo, no usar credenciales reales en el repositorio).

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
FRONTEND_URL=http://localhost:5173
NODE_TLS_REJECT_UNAUTHORIZED=0

# Seeder - Admin Principal
SEEDER_ADMIN_EMAIL=admin@feelwell.com
SEEDER_ADMIN_PHONE=00000000
SEEDER_ADMIN_PASSWORD=tu_password_aqui

# Seeder - Admin Usuarios
SEEDER_ADMIN_USERS_EMAIL=admin.users@feelwell.com
SEEDER_ADMIN_USERS_PHONE=00000000
SEEDER_ADMIN_USERS_PASSWORD=tu_password_aqui

# Seeder - Admin Mood Tracking
SEEDER_ADMIN_MOOD_EMAIL=admin.mood@feelwell.com
SEEDER_ADMIN_MOOD_PHONE=00000000
SEEDER_ADMIN_MOOD_PASSWORD=tu_password_aqui

# Seeder - Admin Healthy
SEEDER_ADMIN_HEALTHY_EMAIL=admin.healthy@feelwell.com
SEEDER_ADMIN_HEALTHY_PHONE=00000000
SEEDER_ADMIN_HEALTHY_PASSWORD=tu_password_aqui
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

# RabbitMQ
RABBITMQ_URL=amqp://admin:tu_password@localhost:5672
RABBITMQ_USER=admin
RABBITMQ_PASS=tu_password
RABBITMQ_EXCHANGE=mood.events
RABBITMQ_DLX=mood.events.dlx
RABBITMQ_PREFETCH=10
RABBITMQ_RECONNECT_DELAY_MS=1000
RABBITMQ_RECONNECT_MAX_DELAY_MS=30000
RABBITMQ_MAX_RETRIES=3

NODE_ENV=development
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### ai-chat-service/.env
```env
PORT=3007

URI_MONGODB=mongodb://localhost:27017/feel-well-ai

JWT_SECRET=tu_secreto_aqui
JWT_ISSUER=feelWell
JWT_AUDIENCE=feelWell
JWT_EXPIRES_IN=1h

GROQ_API_KEY=tu_api_key_de_groq
```

### client-admin/.env
```env
VITE_AUTH_URL=http://localhost:3006/feelWeell/v1
VITE_AI_URL=http://localhost:3007/feelWeell/v1
VITE_HEALTHY_URL=http://localhost:3008/feelWeell/v1
VITE_MOOD_URL=http://localhost:3001/feelWeell/v1
VITE_DAILY_URL=http://localhost:5001/api/
VITE_DAILY_MESSAGE_URL=http://localhost:5001
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

## 4. Levantar RabbitMQ

El repositorio incluye un `docker-compose.yml` que levanta únicamente el contenedor de RabbitMQ, requerido por el Mood Tracking Service:

```bash
cd pg-rabbitmq
docker compose up -d
```

Esto expone RabbitMQ en el puerto `5672` y su panel de administración en `http://localhost:15672`.

## 5. Iniciar los servicios

### Opción A — Todos a la vez desde la raíz

El `package.json` raíz define un script que levanta los cinco servicios Node.js y el cliente en paralelo usando `concurrently`:

```bash
pnpm run start
```

> Este comando no levanta el Daily Positive Service (.NET); ese servicio debe iniciarse por separado (ver Opción B) o agregarse manualmente al `.env`/scripts si se desea incluir en el flujo.

### Opción B — Cada servicio por separado

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

# Terminal 4 — AI Chat Service
cd ai-chat-service
pnpm run dev

# Terminal 5 — Daily Positive Service (.NET)
cd daily-positive-service
dotnet restore
dotnet run --project src/DailyPositive.Api

# Terminal 6 — Cliente web
cd client-admin
pnpm run dev
```

El cliente web queda disponible en `http://localhost:5173` (puerto por defecto de Vite).

---

# Documentación de la API

Cada microservicio en Node.js expone su propia documentación interactiva generada con Swagger:

| Servicio | Swagger UI |
|---|---|
| Auth Service | `http://localhost:3006/api-docs` |
| Healthy Service | `http://localhost:3008/feelWeell/v1/api-docs` |
| Mood Tracking Service | `http://localhost:3001/feelWeell/v1/api-docs` |
| AI Chat Service | `http://localhost:3007/feelWeell/v1/api-docs` |

El Daily Positive Service (.NET) expone su documentación mediante Swagger/OpenAPI generado por ASP.NET Core al iniciar el proyecto.

---

# Créditos

Proyecto base desarrollado por:
**Braulio Echeverría**
Curso IN6AM – Kinal Guatemala 2026

Repositorio Original:
https://github.com/IN6AMProm33/auth-service-dotnet.git

Desarrollado y adaptado por **Los Debuggers** (curso IN6AM, Fundación Kinal), incluyendo el frontend `client-admin`, el servicio de IA conversacional `ai-chat-service` ("Tiyú"), y las extensiones de retos diarios y notificaciones sobre los servicios base.

**NOTA**
Este proyecto fue utilizado como referencia académica y posteriormente adaptado y modificado. También se tomó como referencia información que viene de las siguientes fuentes:

- Auth0. (2024). [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- express-validator. (2024). [express-validator documentation](https://express-validator.github.io/docs/)
- Axios. (2024). [Axios Documentation](https://axios-http.com/docs/intro)
- Mongoose. (2024). [Mongoose Documentation](https://mongoosejs.com/docs/)
- Zustand. (2024). [Zustand Documentation](https://zustand.docs.pmnd.rs/)
- Groq. (2024). [Groq API Documentation](https://console.groq.com/docs)

---