import {
  CHECKLIST_TEMPLATES,
  computeItemCost,
  hasCostInputs,
  plannedDateFromPlanting,
  resolveAutoField,
  sortItemsByPlannedDate,
  type ChecklistItemState,
  type ChecklistItemTemplate,
  type ChecklistPlanContext,
} from "@beli-luk/shared";
import type { ChecklistItem } from "@/lib/db/schema";

export function defaultFieldValues(
  template: ChecklistItemTemplate,
  ctx: ChecklistPlanContext,
  plantingStartDate?: string,
): Record<string, string> {
  const values: Record<string, string> = {};
  const plannedDate =
    plantingStartDate != null
      ? plannedDateFromPlanting(plantingStartDate, template.daysFromPlanting)
      : null;

  for (const field of template.fields) {
    if (field.autoFrom) {
      values[field.key] = resolveAutoField(field.autoFrom, ctx);
    } else if (field.defaultValue != null) {
      values[field.key] = field.defaultValue;
    } else if (plannedDate && field.type === "date") {
      values[field.key] = plannedDate;
    }
  }
  return values;
}

export function mergeChecklistItem(
  template: ChecklistItemTemplate,
  ctx: ChecklistPlanContext,
  plantingStartDate: string,
  row?: ChecklistItem | null,
): ChecklistItemState & { template: ChecklistItemTemplate } {
  const plannedDueDate = plannedDateFromPlanting(
    plantingStartDate,
    template.daysFromPlanting,
  );
  const defaults = defaultFieldValues(template, ctx, plantingStartDate);
  let fieldValues = defaults;

  if (row?.fieldValues) {
    try {
      const parsed = JSON.parse(row.fieldValues) as Record<string, string>;
      fieldValues = { ...defaults, ...parsed };
      for (const field of template.fields) {
        if (field.autoFrom) {
          fieldValues[field.key] = resolveAutoField(field.autoFrom, ctx);
        }
      }
    } catch {
      fieldValues = defaults;
    }
  }

  // Ljubičasti "Planirano" i prazna date polja uvek prate datum sadnje
  for (const field of template.fields) {
    if (field.type === "date" && !fieldValues[field.key]) {
      fieldValues[field.key] = plannedDueDate;
    }
  }

  const totalComputed = hasCostInputs(template.costCalc, fieldValues)
    ? computeItemCost(template.costCalc, fieldValues)
    : null;

  return {
    template,
    itemKey: template.key,
    completed: row?.completed ?? false,
    completedAt: row?.completedAt ?? null,
    fieldValues,
    totalCostRsd: totalComputed,
    plannedDueDate,
  };
}

export function buildMergedChecklist(
  ctx: ChecklistPlanContext,
  plantingStartDate: string,
  rows: ChecklistItem[],
): Array<ChecklistItemState & { template: ChecklistItemTemplate }> {
  const byKey = new Map(rows.map((r) => [r.itemKey, r]));
  const items = CHECKLIST_TEMPLATES.map((template) =>
    mergeChecklistItem(template, ctx, plantingStartDate, byKey.get(template.key)),
  );
  return sortItemsByPlannedDate(items);
}

export { buildPlanContext } from "@beli-luk/shared";
