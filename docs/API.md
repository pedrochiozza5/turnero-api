# API REST — referencia breve

URL local: `http://localhost:3000`.

## Modelo de datos

| Campo | Tipo | Detalle |
|---|---|---|
| `id` | entero | Identificador autogenerado |
| `title` | string | Nombre de cliente; 3 a 120 caracteres |
| `description` | string o null | Datos del turno, hasta 500 caracteres |
| `completed` | boolean | `false` al crear; `true` cuando fue atendido |
| `created_at` | string | Momento de alta registrado por SQLite |

## Rutas

- `GET /health`: devuelve `{ "status": "ok", "service": "taskflow-api" }`.
- `GET /api/tasks`: `{ data: [...], pagination: { page, limit, total, pages } }`. Parámetros opcionales `completed=true|false`, `page` (desde 1), `limit` (1–50, por defecto 10).
- `GET /api/tasks/:id`: `{ data: registro }` o `404`.
- `POST /api/tasks`: JSON `{ "title": "María González", "description": "Viernes 16:30" }`; devuelve `201` y `{ data: registro }`.
- `PATCH /api/tasks/:id`: acepta uno o más campos `title`, `description`, `completed`; devuelve `{ data: registro }`.
- `DELETE /api/tasks/:id`: devuelve `204` sin cuerpo. No hace falta enviar `Content-Type` ni JSON.

Las entradas inválidas devuelven `400` y los registros inexistentes devuelven `404`.

## Prueba en PowerShell

```powershell
Invoke-RestMethod http://localhost:3000/health
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -ContentType 'application/json' -Body '{"title":"María González","description":"Viernes 16:30"}'
Invoke-RestMethod http://localhost:3000/api/tasks
# Reemplazá 1 con el ID real obtenido del listado:
Invoke-RestMethod -Method Delete -Uri http://localhost:3000/api/tasks/1
```
