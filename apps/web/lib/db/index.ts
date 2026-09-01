import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";
import * as schema from "./schema";
import { seedDatabase } from "./seed";
import { ensureChecklistTable } from "./ensure-checklist";

const DB_PATH = path.join(process.cwd(), "data", "beli-luk.db");

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!dbInstance) {
    const sqlite = new Database(DB_PATH);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    const db = drizzle(sqlite, { schema });

    const migrationsFolder = path.join(process.cwd(), "drizzle");
    try {
      migrate(db, { migrationsFolder });
    } catch (error) {
      console.error("[db] migrate failed, applying checklist fallback:", error);
    }
    ensureChecklistTable(sqlite);

    dbInstance = db;
    seedDatabase(dbInstance);
  }

  return dbInstance;
}

export { schema };
