"use server";

import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { formatISO } from "date-fns";
import { getDb, schema } from "@/lib/db";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/njiva");
  revalidatePath("/sadnja");
  revalidatePath("/kalendar");
  revalidatePath("/dnevnik");
  revalidatePath("/berba");
}

export async function logPlanting(formData: FormData) {
  const sectorId = Number(formData.get("sectorId"));
  const kgPlanted = Number(formData.get("kgPlanted"));
  const notes = (formData.get("notes") as string) || null;

  if (!sectorId || !kgPlanted || kgPlanted <= 0) {
    throw new Error("Unesite validnu količinu.");
  }

  const db = getDb();
  const inventory = db.select().from(schema.seedInventory).limit(1).get();
  if (!inventory) throw new Error("Nema evidencije sadnog materijala.");

  const remaining = inventory.totalKg - inventory.usedKg;
  if (kgPlanted > remaining + 0.01) {
    throw new Error(`Preostalo je samo ${remaining.toFixed(1)} kg sadnog materijala.`);
  }

  const now = formatISO(new Date(), { representation: "date" });

  db.insert(schema.plantingLogs)
    .values({
      sectorId,
      seedInventoryId: inventory.id,
      kgPlanted,
      plantedAt: now,
      notes,
    })
    .run();

  db.update(schema.seedInventory)
    .set({ usedKg: inventory.usedKg + kgPlanted })
    .where(eq(schema.seedInventory.id, inventory.id))
    .run();

  const sectorLogs = db
    .select()
    .from(schema.plantingLogs)
    .where(eq(schema.plantingLogs.sectorId, sectorId))
    .all();
  const sectorTotal = sectorLogs.reduce((sum, log) => sum + log.kgPlanted, 0);
  const sector = db
    .select()
    .from(schema.sectors)
    .where(eq(schema.sectors.id, sectorId))
    .get();

  if (sector) {
    const estimatedKg = inventory.totalKg;
    let status: "empty" | "planting" | "planted" = "planting";
    if (sectorTotal >= estimatedKg * 0.95) {
      status = "planted";
    } else if (sectorTotal > 0) {
      status = "planting";
    }

    db.update(schema.sectors)
      .set({ status })
      .where(eq(schema.sectors.id, sectorId))
      .run();
  }

  const planting = db.select().from(schema.plantings).limit(1).get();
  if (planting && planting.status === "planning") {
    db.update(schema.plantings)
      .set({ status: "planting" })
      .where(eq(schema.plantings.id, planting.id))
      .run();
  }

  revalidateAll();
}

export async function toggleTask(taskId: number, completed: boolean) {
  const db = getDb();
  db.update(schema.tasks)
    .set({
      completed,
      completedAt: completed
        ? formatISO(new Date(), { representation: "date" })
        : null,
    })
    .where(eq(schema.tasks.id, taskId))
    .run();

  revalidateAll();
}

export async function addJournalEntry(formData: FormData) {
  const sectorId = formData.get("sectorId")
    ? Number(formData.get("sectorId"))
    : null;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title?.trim() || !content?.trim()) {
    throw new Error("Naslov i sadržaj su obavezni.");
  }

  const db = getDb();
  db.insert(schema.journalEntries)
    .values({
      sectorId,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    })
    .run();

  revalidateAll();
}

export async function logHarvest(formData: FormData) {
  const sectorId = Number(formData.get("sectorId"));
  const kgHarvested = Number(formData.get("kgHarvested"));
  const notes = (formData.get("notes") as string) || null;

  if (!sectorId || !kgHarvested || kgHarvested <= 0) {
    throw new Error("Unesite validan prinos.");
  }

  const db = getDb();
  const planting = db.select().from(schema.plantings).limit(1).get();
  if (!planting) throw new Error("Nema aktivne sezone.");

  const now = formatISO(new Date(), { representation: "date" });

  db.insert(schema.harvests)
    .values({
      sectorId,
      plantingId: planting.id,
      kgHarvested,
      harvestedAt: now,
      notes,
    })
    .run();

  db.update(schema.sectors)
    .set({ status: "harvested" })
    .where(eq(schema.sectors.id, sectorId))
    .run();

  const allSectors = db
    .select()
    .from(schema.sectors)
    .where(eq(schema.sectors.fieldId, planting.fieldId))
    .all();
  const allHarvested = allSectors.every((s) => s.status === "harvested");
  if (allHarvested) {
    db.update(schema.plantings)
      .set({ status: "completed" })
      .where(eq(schema.plantings.id, planting.id))
      .run();
  } else {
    db.update(schema.plantings)
      .set({ status: "harvesting" })
      .where(eq(schema.plantings.id, planting.id))
      .run();
  }

  revalidateAll();
}

export async function getPlantingLogs() {
  const db = getDb();
  return db
    .select({
      id: schema.plantingLogs.id,
      sectorId: schema.plantingLogs.sectorId,
      sectorName: schema.sectors.name,
      kgPlanted: schema.plantingLogs.kgPlanted,
      plantedAt: schema.plantingLogs.plantedAt,
      notes: schema.plantingLogs.notes,
    })
    .from(schema.plantingLogs)
    .innerJoin(
      schema.sectors,
      eq(schema.plantingLogs.sectorId, schema.sectors.id),
    )
    .orderBy(desc(schema.plantingLogs.plantedAt))
    .all();
}
