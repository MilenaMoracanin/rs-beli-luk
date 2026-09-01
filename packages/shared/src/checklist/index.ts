export * from "./types";
export * from "./templates";
export * from "./area-table";
export * from "./dates";
export {
  buildPlanContext,
  computeItemCost,
  hasCostInputs,
  formatRsd,
  resolveAutoField,
  type ChecklistPlanContext,
  type AutoFieldKey,
} from "./estimate-costs";

import { CHECKLIST_PHASES, CHECKLIST_TEMPLATES } from "./templates";
import { computeItemCost, hasCostInputs } from "./estimate-costs";
import type { ChecklistItemState } from "./types";
import type { ChecklistPlanContext } from "./estimate-costs";

export function itemTotalCost(
  itemKey: string,
  fieldValues: Record<string, string>,
): number | null {
  const template = CHECKLIST_TEMPLATES.find((t) => t.key === itemKey);
  if (!template) return null;
  if (!hasCostInputs(template.costCalc, fieldValues)) return null;
  return computeItemCost(template.costCalc, fieldValues);
}

export function buildChecklistStates(
  ctx: ChecklistPlanContext,
  saved: Record<string, Partial<ChecklistItemState>> = {},
): ChecklistItemState[] {
  return CHECKLIST_TEMPLATES.map((template) => {
    const existing = saved[template.key];
    const fieldValues = existing?.fieldValues ?? {};
    const total =
      existing?.totalCostRsd ??
      (hasCostInputs(template.costCalc, fieldValues)
        ? computeItemCost(template.costCalc, fieldValues)
        : null);

    return {
      itemKey: template.key,
      completed: existing?.completed ?? false,
      completedAt: existing?.completedAt ?? null,
      fieldValues,
      totalCostRsd: total,
      plannedDueDate: null,
    };
  });
}

export function phaseTotals(items: Array<ChecklistItemState & { template?: { phase: string } }>) {
  const totals: Record<string, number> = {};
  for (const phase of CHECKLIST_PHASES) {
    totals[phase.id] = 0;
  }
  for (const item of items) {
    const template = CHECKLIST_TEMPLATES.find((t) => t.key === item.itemKey);
    if (!template || item.totalCostRsd == null) continue;
    totals[template.phase] += item.totalCostRsd;
  }
  return totals;
}

export function seasonTotal(items: ChecklistItemState[]): number {
  return items.reduce((sum, item) => sum + (item.totalCostRsd ?? 0), 0);
}
