// src/db/conexion.ts - Conexión SQLite y gestor de migraciones numeradas
import Database, { type Database as DatabaseType } from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance: DatabaseType | null = null;

export function obtenerConexion(rutaDb?: string): DatabaseType {
  if (dbInstance && !rutaDb) {
    return dbInstance;
  }

  const rutaFinal = rutaDb || process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'app.db');

  if (rutaFinal !== ':memory:') {
    const dir = path.dirname(rutaFinal);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new Database(rutaFinal);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  aplicarMigraciones(db);

  if (!rutaDb) {
    dbInstance = db;
  }

  return db;
}

export function cerrarConexion(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

export function aplicarMigraciones(db: DatabaseType): void {
  // Asegurar tabla de control de versiones de esquema
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const migracionesDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migracionesDir)) {
    return;
  }

  const archivos = fs.readdirSync(migracionesDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const stmtCheck = db.prepare('SELECT 1 FROM schema_migrations WHERE version = ?');
  const stmtInsert = db.prepare('INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)');

  for (const archivo of archivos) {
    const yaAplicada = stmtCheck.get(archivo);
    if (!yaAplicada) {
      const contenidoSql = fs.readFileSync(path.join(migracionesDir, archivo), 'utf-8');
      db.transaction(() => {
        db.exec(contenidoSql);
        stmtInsert.run(archivo, new Date().toISOString());
      })();
    }
  }
}
