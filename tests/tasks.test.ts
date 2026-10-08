import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import { openDatabase } from '../src/db.js';

test('CRUD completo y validaciones', async () => {
  const db = openDatabase(':memory:');
  const app = buildApp(db);
  try {
    const home = await app.inject({ method: 'GET', url: '/' });
    assert.equal(home.statusCode, 200);
    assert.match(home.body, /Agenda de turnos/);
    const invalid = await app.inject({ method: 'POST', url: '/api/tasks', payload: { title: 'a' } });
    assert.equal(invalid.statusCode, 400);
    const created = await app.inject({ method: 'POST', url: '/api/tasks', payload: { title: 'Publicar proyecto' } });
    assert.equal(created.statusCode, 201);
    const id = created.json().data.id;
    const updated = await app.inject({ method: 'PATCH', url: `/api/tasks/${id}`, payload: { completed: true } });
    assert.equal(updated.json().data.completed, true);
    const listed = await app.inject({ method: 'GET', url: '/api/tasks?completed=true&page=1&limit=10' });
    assert.equal(listed.json().pagination.total, 1);
    assert.equal(listed.json().data[0].id, id);
    const deleted = await app.inject({ method: 'DELETE', url: `/api/tasks/${id}` });
    assert.equal(deleted.statusCode, 204);
    const missing = await app.inject({ method: 'GET', url: `/api/tasks/${id}` });
    assert.equal(missing.statusCode, 404);
  } finally {
    await app.close();
    db.close();
  }
});
