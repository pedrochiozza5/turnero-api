# Publicar Turnero en GitHub

1. Creá en GitHub un repositorio vacío llamado `turnero-api`, **sin** agregar otro README ni licencia.
2. Abrí una terminal dentro de la carpeta del proyecto y ejecutá:

```powershell
git init
git add .
git commit -m "feat: turnero web y API REST con Fastify"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/turnero-api.git
git push -u origin main
```

Cambiá `TU-USUARIO` por tu nombre de usuario real. Si el repositorio ya tenía Git inicializado o un remoto `origin`, revisá con `git remote -v` antes de agregar otro.

## Descripción breve para GitHub

`Sistema web de turnos con API REST en TypeScript, Fastify, SQLite y validación con Zod.`

## Temas sugeridos

`typescript`, `nodejs`, `fastify`, `sqlite`, `rest-api`, `backend`, `portfolio`

## Antes de difundir

- Confirmá que `npm run check`, `npm test` y `npm run build` terminen correctamente.
- Probá crear, marcar como atendido y eliminar un turno desde la web.
- Subí una captura real de la agenda a `docs/capturas/agenda.png` y enlazala en README.
- No publiques clientes reales, claves, archivos `.env` ni `data/tasks.db`.
- Compartí un video breve con el flujo completo y el enlace al repo.
