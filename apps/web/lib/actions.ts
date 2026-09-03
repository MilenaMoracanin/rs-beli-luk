"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { addDays, formatISO } from "date-fns";
import {
  BOSUT,
  CHECKLIST_TEMPLATES,
  plannedDateFromPlanting,
} from "@beli-luk/shared";
import { getDb, schema } from "@/lib/db";
import { SEASON_NAME } from "@/lib/site";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/sezona", "layout");
}

function isIsoDate(value: string | undefined): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

/** Pomeri datume u checklisti kad se promeni datum sadnje. */
function cascadeChecklistDates(
  plantingId: number,
  oldPlantingDate: string,
  newPlantingDate: string,
) {
  if (oldPlantingDate === newPlantingDate) return;

  const db = getDb();
  const now = formatISO(new Date(), { representation: "date" });
  const rows = db
    .select()
    .from(schema.checklistItems)
    .where(eq(schema.checklistItems.plantingId, plantingId))
    .all();
  const byKey = new Map(rows.map((row) => [row.itemKey, row]));

  for (const template of CHECKLIST_TEMPLATES) {
    const row = byKey.get(template.key);
    if (!row) continue;

    let values: Record<string, string> = {};
    try {
      values = JSON.parse(row.fieldValues) as Record<string, string>;
    } catch {
      values = {};
    }

    const newPlanned = plannedDateFromPlanting(
      newPlantingDate,
      template.daysFromPlanting,
    );

    let changed = false;
    for (const field of template.fields) {
      if (field.type !== "date") continue;
      // Forsiraj ažuriranje datuma u svim sekcijama
      values[field.key] = newPlanned;
      changed = true;
    }

    if (!changed) continue;

    db.update(schema.checklistItems)
      .set({
        fieldValues: JSON.stringify(values),
        updatedAt: now,
      })
      .where(eq(schema.checklistItems.id, row.id))
      .run();
  }
}

function syncPlantingDateFromSadnja(
  plantingId: number,
  oldPlantingDate: string,
  termin: string,
) {
  const expectedHarvestDate = formatISO(
    addDays(new Date(`${termin}T12:00:00`), BOSUT.daysToHarvest),
    { representation: "date" },
  );

  const db = getDb();
  db.update(schema.plantings)
    .set({
      plantingStartDate: termin,
      expectedHarvestDate,
    })
    .where(eq(schema.plantings.id, plantingId))
    .run();

  cascadeChecklistDates(plantingId, oldPlantingDate, termin);
}

export async function updateChecklistItem(input: {
  itemKey: string;
  completed: boolean;
  fieldValues: Record<string, string>;
  totalCostRsd: number | null;
}) {
  const db = getDb();
  const planting = db.select().from(schema.plantings).limit(1).get();
  if (!planting) throw new Error(`Nema aktivne ${SEASON_NAME}.`);

  const now = formatISO(new Date(), { representation: "date" });
  const existing = db
    .select()
    .from(schema.checklistItems)
    .where(eq(schema.checklistItems.plantingId, planting.id))
    .all()
    .find((r) => r.itemKey === input.itemKey);

  const values = {
    completed: input.completed,
    completedAt: input.completed ? now : null,
    fieldValues: JSON.stringify(input.fieldValues),
    estimatedCostRsd: input.totalCostRsd,
    actualCostRsd: input.totalCostRsd,
    updatedAt: now,
  };

  if (existing) {
    db.update(schema.checklistItems)
      .set(values)
      .where(eq(schema.checklistItems.id, existing.id))
      .run();
  } else {
    db.insert(schema.checklistItems)
      .values({
        plantingId: planting.id,
        itemKey: input.itemKey,
        ...values,
      })
      .run();
  }

  if (input.itemKey === "sadnja" && isIsoDate(input.fieldValues.termin)) {
    const termin = input.fieldValues.termin;
    if (termin !== planting.plantingStartDate) {
      syncPlantingDateFromSadnja(
        planting.id,
        planting.plantingStartDate,
        termin,
      );
    }
  }

  revalidateAll();
}
