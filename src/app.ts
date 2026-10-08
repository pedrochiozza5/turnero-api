import Fastify from 'fastify';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import type { DatabaseSync } from 'node:sqlite';
import type { Task } from './db.js';

const taskInput = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(500).nullable().optional()
}).strict();
const taskUpdate = taskInput.partial().extend({ completed: z.boolean().optional() }).strict()
  .refine((value) => Object.keys(value).length > 0, 'Enviá al menos un campo');
const idParam = z.object({ id: z.coerce.number().int().positive() });
const queryInput = z.object({
  completed: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});

function serialize(task: Task) {
  return { ...task, completed: Boolean(task.completed) };
}

export function buildApp(db: DatabaseSync) {
  const app = Fastify({ logger: false });

  app.get('/', async (_request, reply) => {
    const html = readFileSync(join(process.cwd(), 'public', 'index.html'), 'utf8');
    return reply.type('text/html; charset=utf-8').send(html);
  });

  app.get('/health', async () => ({ status: 'ok', service: 'taskflow-api' }));

  app.get('/api/tasks', async (request, reply) => {
    const parsed = queryInput.safeParse(request.query);
    if (!parsed.success) return reply.code(400).send({ error: 'Parámetros inválidos', details: z.flattenError(parsed.error) });
    const { completed, page, limit } = parsed.data;
    const where = completed === undefined ? '' : 'WHERE completed = ?';
    const values = completed === undefined ? [] : [completed === 'true' ? 1 : 0];
    const total = (db.prepare(`SELECT COUNT(*) AS total FROM tasks ${where}`).get(...values) as { total: number }).total;
    const items = db.prepare(`SELECT * FROM tasks ${where} ORDER BY id DESC LIMIT ? OFFSET ?`)
      .all(...values, limit, (page - 1) * limit) as Task[];
    return { data: items.map(serialize), pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  });

  app.get('/api/tasks/:id', async (request, reply) => {
    const parsed = idParam.safeParse(request.params);
    if (!parsed.success) return reply.code(400).send({ error: 'ID inválido' });
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(parsed.data.id) as Task | undefined;
    if (!task) return reply.code(404).send({ error: 'Tarea no encontrada' });
    return { data: serialize(task) };
  });

  app.post('/api/tasks', async (request, reply) => {
    const parsed = taskInput.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos', details: z.flattenError(parsed.error) });
    const { title, description = null } = parsed.data;
    const result = db.prepare('INSERT INTO tasks (title, description) VALUES (?, ?)').run(title, description);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(Number(result.lastInsertRowid)) as Task;
    return reply.code(201).send({ data: serialize(task) });
  });

  app.patch('/api/tasks/:id', async (request, reply) => {
    const id = idParam.safeParse(request.params);
    if (!id.success) return reply.code(400).send({ error: 'ID inválido' });
    const parsed = taskUpdate.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'Datos inválidos', details: z.flattenError(parsed.error) });
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id.data.id) as Task | undefined;
    if (!existing) return reply.code(404).send({ error: 'Tarea no encontrada' });
    const { title = existing.title, description = existing.description, completed } = parsed.data;
    db.prepare('UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?')
      .run(title, description, completed === undefined ? existing.completed : Number(completed), id.data.id);
    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id.data.id) as Task;
    return { data: serialize(updated) };
  });

  app.delete('/api/tasks/:id', async (request, reply) => {
    const id = idParam.safeParse(request.params);
    if (!id.success) return reply.code(400).send({ error: 'ID inválido' });
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id.data.id);
    if (result.changes === 0) return reply.code(404).send({ error: 'Tarea no encontrada' });
    return reply.code(204).send();
  });

  return app;
}
