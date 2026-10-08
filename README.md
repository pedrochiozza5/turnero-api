# Turnero — Agenda digital

**Aplicación web de gestión básica de turnos**, con una API REST implementada en TypeScript, Fastify y SQLite. Proyecto de portfolio orientado a demostrar creación de endpoints, validación de datos, operaciones CRUD y persistencia.

> Demo local. La fecha, la hora y el motivo de cada turno se escriben en un campo de texto; **no** hay calendario con horarios bloqueados, recordatorios automáticos ni autenticación.

## Vista general

La aplicación permite:

- Registrar el nombre del cliente y los detalles de su turno.
- Ver turnos pendientes y atendidos.
- Marcar un turno como atendido o volverlo a pendiente.
- Buscar por cliente o descripción.
- Eliminar turnos con confirmación.
- Consultar los totales desde la misma interfaz.

**Capturas:** al ejecutar el proyecto, tomá una captura de la agenda y subila a `docs/capturas/agenda.png`; después agregá la línea `![Agenda de turnos](docs/capturas/agenda.png)` aquí. No se incluye una captura ficticia.

## Stack

| Capa | Tecnología | Uso |
|---|---|---|
| Interfaz | HTML, CSS y JavaScript | Vista responsive y llamadas HTTP con `fetch` |
| Servidor | Node.js, TypeScript y Fastify | Rutas REST y respuestas HTTP |
| Validación | Zod | Verificación de datos de entrada |
| Persistencia | SQLite (`node:sqlite`) | Almacenamiento local |
| Pruebas | Node Test Runner + `fastify.inject` | Test del flujo CRUD |
| Automatización | GitHub Actions | Verificación de tipos, tests y build |

## Requisitos

- Node.js **22 o posterior**; recomendable una versión LTS actual.
- npm.

## Ejecución local

```bash
npm install
npm run dev
```

Abrí **http://localhost:3000**. La primera ejecución crea automáticamente la base local en `data/tasks.db`.

En Windows, si PowerShell bloquea `npm.ps1`, ejecutá `npm.cmd install` y `npm.cmd run dev`.

### Otros comandos

```bash
npm run check   # Tipos TypeScript
npm test        # Pruebas del backend
npm run build   # Compila TypeScript
npm start       # Ejecuta la compilación
```

El directorio `data/`, `.env` y las dependencias locales están excluidos del repositorio mediante `.gitignore`.

## Arquitectura

```text
Navegador (public/index.html)
    │ fetch() / JSON
    ▼
Fastify (src/app.ts)
    │ validación de entradas con Zod
    ▼
SQLite (src/db.ts)
    │
    └── data/tasks.db
```

La API conserva la nomenclatura interna `/api/tasks`, aunque la interfaz se presenta como un anotador de turnos. En la base se guarda **nombre del cliente** (`title`), **datos libres del turno** (`description`) y **estado atendido** (`completed`).

## Endpoints HTTP

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/` | Interfaz web |
| `GET` | `/health` | Estado del servidor |
| `GET` | `/api/tasks` | Listado paginado; filtros `completed`, `page`, `limit` |
| `GET` | `/api/tasks/:id` | Registro por ID |
| `POST` | `/api/tasks` | Crear registro (`201`) |
| `PATCH` | `/api/tasks/:id` | Actualizar datos o estado |
| `DELETE` | `/api/tasks/:id` | Borrar registro (`204`) |

### Ejemplo: crear un turno

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "María González",
  "description": "Viernes 16:30 · Corte de pelo"
}
```

La API devuelve `201 Created` con un objeto `data` que contiene el nuevo registro.

### Ejemplo: marcar como atendido

```http
PATCH /api/tasks/1
Content-Type: application/json

{"completed": true}
```

### Ejemplo: eliminar

```http
DELETE /api/tasks/1
```

Si el registro existe, devuelve `204 No Content`; si no existe, `404`.

La documentación detallada de los campos y respuestas está en [docs/API.md](docs/API.md).

## Decisiones técnicas

- Consultas SQL parametrizadas para los valores ingresados por el usuario.
- Errores de validación con estado HTTP `400`.
- Separación entre arranque (`server.ts`), definición HTTP (`app.ts`) y almacenamiento (`db.ts`).
- Test del ciclo crear → actualizar → listar → eliminar con una base en memoria.
- Una sola aplicación sirve el frontend y la API, sin necesidad de ejecutar dos procesos.

## Limitaciones y posibles mejoras

Actualmente no hay autenticación ni gestión de múltiples usuarios, no se evitan turnos superpuestos y el campo fecha/hora es texto libre. Posibles mejoras: formularios con fechas estructuradas, control de disponibilidad, roles, Swagger/OpenAPI y despliegue público.

## Autor

**Pedro Chiozza — CZTECNO**  
Proyecto de práctica y demostración de desarrollo backend.

## Licencia

MIT. Consultar [LICENSE](LICENSE).
