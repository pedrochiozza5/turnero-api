import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: number;
  created_at: string;
};

export function openDatabase(path = process.env.DB_PATH ?? './data/tasks.db') {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}
