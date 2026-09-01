import type Database from "better-sqlite3";

/** Fallback ako migracija 0002 nije prošla (npr. stari dev server / HMR). */
export function ensureChecklistTable(sqlite: Database.Database) {
  const exists = sqlite
    .prepare(
      "SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = 'checklist_items'",
    )
    .get();

  if (exists) return;

  sqlite.exec(`
    CREATE TABLE checklist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      planting_id INTEGER NOT NULL,
      item_key TEXT NOT NULL,
      completed INTEGER DEFAULT 0 NOT NULL,
      completed_at TEXT,
      field_values TEXT DEFAULT '{}' NOT NULL,
      estimated_cost_rsd REAL,
      actual_cost_rsd REAL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (planting_id) REFERENCES plantings(id)
    );
    CREATE UNIQUE INDEX checklist_items_planting_key ON checklist_items (planting_id, item_key);
  `);
}
