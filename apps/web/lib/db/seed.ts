import { eq, asc } from "drizzle-orm";
import { addDays, formatISO } from "date-fns";
import { GARLIC_VARIETIES } from "@beli-luk/shared";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { generateSeasonTasks } from "../garlic/season";

type Db = BetterSQLite3Database<typeof schema>;

function rowCountForWidth(widthM: number, rowSpacingCm: number) {
  return Math.floor(widthM / (rowSpacingCm / 100));
}

function consolidateToSingleSector(db: Db) {
  const field = db.select().from(schema.fields).limit(1).get();
  if (!field) return;

  const sectors = db
    .select()
    .from(schema.sectors)
    .where(eq(schema.sectors.fieldId, field.id))
    .orderBy(asc(schema.sectors.orderIndex))
    .all();

  const variety = GARLIC_VARIETIES[0];
  const fullRowCount = rowCountForWidth(field.widthM, variety.rowSpacingCm);

  if (sectors.length <= 1) {
    if (sectors.length === 1) {
      db.update(schema.sectors)
        .set({
          name: "Njiva",
          orderIndex: 1,
          widthM: field.widthM,
          lengthM: field.lengthM,
          areaM2: field.areaM2,
          rowCount: fullRowCount,
          rowLengthM: field.lengthM,
        })
        .where(eq(schema.sectors.id, sectors[0].id))
        .run();
    }
    return;
  }

  const primary = sectors[0];

  for (const sector of sectors.slice(1)) {
    db.update(schema.plantingLogs)
      .set({ sectorId: primary.id })
      .where(eq(schema.plantingLogs.sectorId, sector.id))
      .run();
    db.update(schema.harvests)
      .set({ sectorId: primary.id })
      .where(eq(schema.harvests.sectorId, sector.id))
      .run();
    db.delete(schema.sectors)
      .where(eq(schema.sectors.id, sector.id))
      .run();
  }

  const statuses = sectors.map((s) => s.status);
  let mergedStatus: (typeof sectors)[number]["status"] = "empty";
  if (statuses.every((s) => s === "harvested")) {
    mergedStatus = "harvested";
  } else if (statuses.some((s) => s === "harvesting" || s === "harvested")) {
    mergedStatus = "harvesting";
  } else if (statuses.every((s) => s === "planted")) {
    mergedStatus = "planted";
  } else if (statuses.some((s) => s === "planting" || s === "planted")) {
    mergedStatus = "planting";
  }

  db.update(schema.sectors)
    .set({
      name: "Njiva",
      orderIndex: 1,
      widthM: field.widthM,
      lengthM: field.lengthM,
      areaM2: field.areaM2,
      rowCount: fullRowCount,
      rowLengthM: field.lengthM,
      status: mergedStatus,
    })
    .where(eq(schema.sectors.id, primary.id))
    .run();
}

export function seedDatabase(db: Db) {
  const existingVarieties = db.select().from(schema.varieties).all();
  if (existingVarieties.length === 0) {
    for (const variety of GARLIC_VARIETIES) {
      db.insert(schema.varieties).values(variety).run();
    }
  }

  const existingFields = db.select().from(schema.fields).all();
  if (existingFields.length > 0) {
    consolidateToSingleSector(db);
    return;
  }

  const now = formatISO(new Date(), { representation: "date" });
  const plantingDate = formatISO(addDays(new Date(), 14), {
    representation: "date",
  });
  const variety = GARLIC_VARIETIES[0];

  const fieldResult = db
    .insert(schema.fields)
    .values({
      name: "Njiva — 10 ari",
      widthM: 20,
      lengthM: 50,
      areaM2: 1000,
      createdAt: now,
    })
    .returning()
    .get();

  const createdSector = db
    .insert(schema.sectors)
    .values({
      fieldId: fieldResult.id,
      name: "Njiva",
      orderIndex: 1,
      widthM: fieldResult.widthM,
      lengthM: fieldResult.lengthM,
      areaM2: fieldResult.areaM2,
      rowCount: rowCountForWidth(fieldResult.widthM, variety.rowSpacingCm),
      rowLengthM: fieldResult.lengthM,
      status: "empty",
    })
    .returning()
    .get();

  const seedResult = db
    .insert(schema.seedInventory)
    .values({
      fieldId: fieldResult.id,
      varietyId: variety.id,
      totalKg: 100,
      usedKg: 0,
      createdAt: now,
    })
    .returning()
    .get();

  const expectedHarvestDate = formatISO(
    addDays(new Date(plantingDate), variety.daysToHarvest),
    { representation: "date" },
  );

  const plantingResult = db
    .insert(schema.plantings)
    .values({
      fieldId: fieldResult.id,
      varietyId: variety.id,
      plantingStartDate: plantingDate,
      expectedHarvestDate,
      status: "planning",
    })
    .returning()
    .get();

  const seasonTasks = generateSeasonTasks(new Date(plantingDate), variety);

  for (const task of seasonTasks) {
    db.insert(schema.tasks)
      .values({
        plantingId: plantingResult.id,
        sectorId: task.sectorId,
        phase: task.phase,
        title: task.title,
        description: task.description,
        dueDate: formatISO(task.dueDate, { representation: "date" }),
        completed: false,
      })
      .run();
  }

  void seedResult;
  void createdSector;
}

export function getDashboardData(db: Db) {
  const field = db.select().from(schema.fields).limit(1).get();
  if (!field) {
    return null;
  }

  const fieldSectors = db
    .select()
    .from(schema.sectors)
    .where(eq(schema.sectors.fieldId, field.id))
    .orderBy(asc(schema.sectors.orderIndex))
    .all();

  const inventory = db
    .select()
    .from(schema.seedInventory)
    .where(eq(schema.seedInventory.fieldId, field.id))
    .limit(1)
    .get();

  const planting = db
    .select()
    .from(schema.plantings)
    .where(eq(schema.plantings.fieldId, field.id))
    .orderBy(schema.plantings.id)
    .limit(1)
    .get();

  const variety = planting
    ? db
        .select()
        .from(schema.varieties)
        .where(eq(schema.varieties.id, planting.varietyId))
        .get()
    : null;

  const allTasks = planting
    ? db
        .select()
        .from(schema.tasks)
        .where(eq(schema.tasks.plantingId, planting.id))
        .all()
    : [];

  const harvests = planting
    ? db
        .select()
        .from(schema.harvests)
        .where(eq(schema.harvests.plantingId, planting.id))
        .all()
    : [];

  return {
    field,
    sectors: fieldSectors,
    inventory,
    planting,
    variety,
    tasks: allTasks,
    harvests,
  };
}
