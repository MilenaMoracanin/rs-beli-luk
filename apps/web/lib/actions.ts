"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { formatISO } from "date-fns";
import { getDb, schema } from "@/lib/db";
import { SEASON_NAME } from "@/lib/site";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/sezona", "layout");
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

  revalidateAll();
}
