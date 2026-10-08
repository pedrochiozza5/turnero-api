import { buildApp } from './app.js';
import { openDatabase } from './db.js';

const db = openDatabase();
const app = buildApp(db);
const port = Number(process.env.PORT ?? 3000);

async function start() {
  try {
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`API disponible en http://localhost:${port}`);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

process.on('SIGINT', async () => { await app.close(); db.close(); process.exit(0); });
process.on('SIGTERM', async () => { await app.close(); db.close(); process.exit(0); });
void start();
