import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Single shared connection, initialized lazily (Next dev hot-reload safe).
const globalForDb = globalThis as unknown as { __db?: Database.Database };

function createDb(): Database.Database {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new Database(path.join(dir, "app.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const schemaPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../../db/SCHEMA.sql");
  db.exec(fs.readFileSync(schemaPath, "utf8"));
  return db;
}

export function getDb(): Database.Database {
  if (!globalForDb.__db) globalForDb.__db = createDb();
  return globalForDb.__db;
}
