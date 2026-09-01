import { eq, asc } from "drizzle-orm";
import { addDays, formatISO } from "date-fns";
import {
  BOSUT,
  CHECKLIST_TEMPLATES,
  DEFAULT_SEED_KG,
  GARLIC_VARIETIES,
  NJIVA_LENGTH_M,
  NJIVA_WIDTH_M,
  buildPlanContext,
  fieldAreaM2,
  planInputFromVariety,
} from "@beli-luk/shared";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { generateSeasonTasks } from "../garlic/season";
import { calculateSeedPlantingPlan } from "../garlic/calculator";
import { defaultFieldValues } from "../checklist/build";

type Db = BetterSQLite3Database<typeof schema>;

function planFromSeed(seedKg: number) {
  return calculateSeedPlantingPlan(
    planInputFromVariety(seedKg, BOSUT, {
      lengthM: NJIVA_LENGTH_M,
      widthM: NJIVA_WIDTH_M,
    }),
  );
}

function ensureChecklistItems(db: Db, plantingId: number, seedKg: number, plantingStartDate: string) {
  const plan = planFromSeed(seedKg);
  const ctx = buildPlanContext({
    seedKg: plan.seedKg,
    areaM2: plan.requiredAreaM2,
    rowSpacingCm: BOSUT.rowSpacingCm,
    inRowSpacingCm: BOSUT.spacingCm,
    totalRowLengthM: plan.totalRowLengthM,
  });

  const now = formatISO(new Date(), { representation: "date" });
  const existingRows = db
    .select()
    .from(schema.checklistItems)
    .where(eq(schema.checklistItems.plantingId, plantingId))
    .all();
  const existingKeys = new Set(existingRows.map((r) => r.itemKey));

  for (const template of CHECKLIST_TEMPLATES) {
    if (existingKeys.has(template.key)) continue;

    db.insert(schema.checklistItems)
      .values({
        plantingId,
        itemKey: template.key,
        completed: false,
        fieldValues: JSON.stringify(defaultFieldValues(template, ctx, plantingStartDate)),
        estimatedCostRsd: null,
        actualCostRsd: null,
        updatedAt: now,
      })
      .run();
  }
}

function ensureChecklistForPlanting(db: Db) {
  const planting = db.select().from(schema.plantings).limit(1).get();
  const inventory = db.select().from(schema.seedInventory).limit(1).get();
  if (!planting || !inventory) return;
  ensureChecklistItems(db, planting.id, inventory.totalKg, planting.plantingStartDate);
}

function syncFieldToSeedPlan(db: Db) {
  const field = db.select().from(schema.fields).limit(1).get();
  const inventory = field
    ? db
        .select()
        .from(schema.seedInventory)
        .where(eq(schema.seedInventory.fieldId, field.id))
        .limit(1)
        .get()
    : null;

  if (!field || !inventory) return;

  const plan = planFromSeed(inventory.totalKg);
  const areaM2 = fieldAreaM2(NJIVA_LENGTH_M, NJIVA_WIDTH_M);

  db.update(schema.fields)
    .set({
      name: `Njiva — Bosut (${inventory.totalKg} kg)`,
      widthM: NJIVA_WIDTH_M,
      lengthM: NJIVA_LENGTH_M,
      areaM2,
    })
    .where(eq(schema.fields.id, field.id))
    .run();

  const sector = db
    .select()
    .from(schema.sectors)
    .where(eq(schema.sectors.fieldId, field.id))
    .limit(1)
    .get();

  if (sector) {
    db.update(schema.sectors)
      .set({
        name: "Njiva",
        widthM: NJIVA_WIDTH_M,
        lengthM: NJIVA_LENGTH_M,
        areaM2,
        rowCount: plan.rowCount,
        rowLengthM: plan.rowLengthM,
      })
      .where(eq(schema.sectors.id, sector.id))
      .run();
  }

  const planting = db
    .select()
    .from(schema.plantings)
    .where(eq(schema.plantings.fieldId, field.id))
    .limit(1)
    .get();

  if (planting && planting.varietyId !== BOSUT.id) {
    db.update(schema.plantings)
      .set({ varietyId: BOSUT.id })
      .where(eq(schema.plantings.id, planting.id))
      .run();
  }
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

  if (sectors.length <= 1) {
    syncFieldToSeedPlan(db);
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
    .set({ status: mergedStatus })
    .where(eq(schema.sectors.id, primary.id))
    .run();

  syncFieldToSeedPlan(db);
}

function ensureBosutOnly(db: Db) {
  for (const variety of GARLIC_VARIETIES) {
    const existing = db
      .select()
      .from(schema.varieties)
      .where(eq(schema.varieties.id, variety.id))
      .get();
    if (!existing) {
      db.insert(schema.varieties).values({
      id: variety.id,
      name: variety.name,
      daysToHarvest: variety.daysToHarvest,
      spacingCm: variety.spacingCm,
      rowSpacingCm: variety.rowSpacingCm,
      plantingDepthCm: variety.plantingDepthCm,
      yieldMinKgPerHa: variety.harvestMultiplierMin,
      yieldMaxKgPerHa: variety.harvestMultiplierMax,
      description: variety.description,
    }).run();
    } else {
      db.update(schema.varieties).set({
        name: variety.name,
        daysToHarvest: variety.daysToHarvest,
        spacingCm: variety.spacingCm,
        rowSpacingCm: variety.rowSpacingCm,
        plantingDepthCm: variety.plantingDepthCm,
        yieldMinKgPerHa: variety.harvestMultiplierMin,
        yieldMaxKgPerHa: variety.harvestMultiplierMax,
        description: variety.description,
      }).where(eq(schema.varieties.id, variety.id)).run();
    }
  }

  const stale = db
    .select()
    .from(schema.varieties)
    .all()
    .filter((v) => v.id !== BOSUT.id);

  for (const v of stale) {
    db.delete(schema.varieties).where(eq(schema.varieties.id, v.id)).run();
  }
}

export function seedDatabase(db: Db) {
  ensureBosutOnly(db);

  const existingFields = db.select().from(schema.fields).all();
  if (existingFields.length > 0) {
    consolidateToSingleSector(db);
    ensureChecklistForPlanting(db);
    return;
  }

  const now = formatISO(new Date(), { representation: "date" });
  const plantingDate = formatISO(addDays(new Date(), 14), {
    representation: "date",
  });

  const plan = planFromSeed(DEFAULT_SEED_KG);
  const areaM2 = fieldAreaM2(NJIVA_LENGTH_M, NJIVA_WIDTH_M);

  const fieldResult = db
    .insert(schema.fields)
    .values({
      name: `Njiva — Bosut (${DEFAULT_SEED_KG} kg)`,
      widthM: NJIVA_WIDTH_M,
      lengthM: NJIVA_LENGTH_M,
      areaM2,
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
      widthM: NJIVA_WIDTH_M,
      lengthM: NJIVA_LENGTH_M,
      areaM2,
      rowCount: plan.rowCount,
      rowLengthM: plan.rowLengthM,
      status: "empty",
    })
    .returning()
    .get();

  db.insert(schema.seedInventory)
    .values({
      fieldId: fieldResult.id,
      varietyId: BOSUT.id,
      totalKg: DEFAULT_SEED_KG,
      usedKg: 0,
      createdAt: now,
    })
    .run();

  const expectedHarvestDate = formatISO(
    addDays(new Date(plantingDate), BOSUT.daysToHarvest),
    { representation: "date" },
  );

  const plantingResult = db
    .insert(schema.plantings)
    .values({
      fieldId: fieldResult.id,
      varietyId: BOSUT.id,
      plantingStartDate: plantingDate,
      expectedHarvestDate,
      status: "planning",
    })
    .returning()
    .get();

  const seasonTasks = generateSeasonTasks(new Date(plantingDate), BOSUT);

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

  ensureChecklistItems(db, plantingResult.id, DEFAULT_SEED_KG, plantingDate);

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

  let checklistRows: (typeof schema.checklistItems.$inferSelect)[] = [];
  if (planting) {
    try {
      checklistRows = db
        .select()
        .from(schema.checklistItems)
        .where(eq(schema.checklistItems.plantingId, planting.id))
        .all();
    } catch {
      checklistRows = [];
    }
  }

  return {
    field,
    sectors: fieldSectors,
    inventory,
    planting,
    variety,
    tasks: allTasks,
    harvests,
    checklistRows,
  };
}
