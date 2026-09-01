import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const varieties = sqliteTable("varieties", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  daysToHarvest: integer("days_to_harvest").notNull(),
  spacingCm: integer("spacing_cm").notNull(),
  rowSpacingCm: integer("row_spacing_cm").notNull(),
  plantingDepthCm: integer("planting_depth_cm").notNull(),
  yieldMinKgPerHa: integer("yield_min_kg_per_ha").notNull(),
  yieldMaxKgPerHa: integer("yield_max_kg_per_ha").notNull(),
  description: text("description").notNull(),
});

export const fields = sqliteTable("fields", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  widthM: real("width_m").notNull(),
  lengthM: real("length_m").notNull(),
  areaM2: real("area_m2").notNull(),
  createdAt: text("created_at").notNull(),
});

export const sectors = sqliteTable("sectors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fieldId: integer("field_id")
    .notNull()
    .references(() => fields.id),
  name: text("name").notNull(),
  orderIndex: integer("order_index").notNull(),
  widthM: real("width_m").notNull(),
  lengthM: real("length_m").notNull(),
  areaM2: real("area_m2").notNull(),
  rowCount: integer("row_count").notNull(),
  rowLengthM: real("row_length_m").notNull(),
  status: text("status", {
    enum: ["empty", "planting", "planted", "harvesting", "harvested"],
  })
    .notNull()
    .default("empty"),
});

export const seedInventory = sqliteTable("seed_inventory", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fieldId: integer("field_id")
    .notNull()
    .references(() => fields.id),
  varietyId: text("variety_id")
    .notNull()
    .references(() => varieties.id),
  totalKg: real("total_kg").notNull(),
  usedKg: real("used_kg").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const plantings = sqliteTable("plantings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fieldId: integer("field_id")
    .notNull()
    .references(() => fields.id),
  varietyId: text("variety_id")
    .notNull()
    .references(() => varieties.id),
  plantingStartDate: text("planting_start_date").notNull(),
  expectedHarvestDate: text("expected_harvest_date").notNull(),
  status: text("status", {
    enum: ["planning", "planting", "growing", "harvesting", "completed"],
  })
    .notNull()
    .default("planning"),
});

export const plantingLogs = sqliteTable("planting_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sectorId: integer("sector_id")
    .notNull()
    .references(() => sectors.id),
  seedInventoryId: integer("seed_inventory_id")
    .notNull()
    .references(() => seedInventory.id),
  kgPlanted: real("kg_planted").notNull(),
  plantedAt: text("planted_at").notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  plantingId: integer("planting_id")
    .notNull()
    .references(() => plantings.id),
  sectorId: integer("sector_id").references(() => sectors.id),
  phase: text("phase", {
    enum: ["planting", "maintenance", "harvest", "storage"],
  }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: text("due_date").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  completedAt: text("completed_at"),
});

export const harvests = sqliteTable("harvests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sectorId: integer("sector_id")
    .notNull()
    .references(() => sectors.id),
  plantingId: integer("planting_id")
    .notNull()
    .references(() => plantings.id),
  kgHarvested: real("kg_harvested").notNull(),
  harvestedAt: text("harvested_at").notNull(),
});

export type Field = typeof fields.$inferSelect;
export type Sector = typeof sectors.$inferSelect;
export type SeedInventory = typeof seedInventory.$inferSelect;
export type Planting = typeof plantings.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Harvest = typeof harvests.$inferSelect;
