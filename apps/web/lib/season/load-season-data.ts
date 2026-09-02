import { cache } from "react";
import { getDb } from "@/lib/db";
import { getDashboardData } from "@/lib/db/seed";
import {
  calculateSeedPlantingPlan,
  type SeedPlantingPlan,
} from "@/lib/garlic/calculator";
import {
  estimateYieldFromSeed,
  getDaysUntilHarvest,
  getHarvestStats,
  type YieldEstimate,
} from "@/lib/garlic/yield";
import { buildMergedChecklist, buildPlanContext } from "@/lib/checklist/build";
import { BOSUT, NJIVA_LENGTH_M, NJIVA_WIDTH_M, phaseTotals, planInputFromVariety } from "@beli-luk/shared";
import type { ChecklistItemState } from "@beli-luk/shared";
import type { ChecklistItemTemplate } from "@beli-luk/shared";

export type SeasonViewModel = {
  data: {
    inventory: NonNullable<NonNullable<ReturnType<typeof getDashboardData>>["inventory"]>;
    planting: NonNullable<NonNullable<ReturnType<typeof getDashboardData>>["planting"]>;
  };
  plan: SeedPlantingPlan;
  yieldEstimate: YieldEstimate;
  harvestStats: ReturnType<typeof getHarvestStats>;
  daysUntilHarvest: number;
  checklistItems: Array<ChecklistItemState & { template: ChecklistItemTemplate }>;
  checklistTotals: Record<string, number>;
  checklistInRow: number;
  checklistRowGap: number;
};

export const loadSeasonData = cache((): SeasonViewModel | null => {
  getDb();
  const data = getDashboardData(getDb());

  if (!data?.inventory || !data.planting) {
    return null;
  }

  const fieldInput = {
    lengthM: NJIVA_LENGTH_M,
    widthM: NJIVA_WIDTH_M,
  };

  const basePlan = calculateSeedPlantingPlan(
    planInputFromVariety(data.inventory.totalKg, BOSUT, fieldInput),
  );

  const baseCtx = buildPlanContext({
    seedKg: basePlan.seedKg,
    areaM2: basePlan.requiredAreaM2,
    rowSpacingCm: BOSUT.rowSpacingCm,
    inRowSpacingCm: BOSUT.spacingCm,
    totalRowLengthM: basePlan.totalRowLengthM,
  });

  const checklistItemsDraft = buildMergedChecklist(
    baseCtx,
    data.planting.plantingStartDate,
    data.checklistRows ?? [],
  );
  const sadnjaItem = checklistItemsDraft.find((i) => i.itemKey === "sadnja");
  const checklistInRow = Number(sadnjaItem?.fieldValues.razmak_u_redu) || BOSUT.spacingCm;
  const checklistRowGap = Number(sadnjaItem?.fieldValues.razmak_redova) || BOSUT.rowSpacingCm;

  const plan = calculateSeedPlantingPlan({
    ...planInputFromVariety(data.inventory.totalKg, BOSUT, fieldInput),
    inRowSpacingCm: checklistInRow,
    rowSpacingCm: checklistRowGap,
  });

  const ctx = buildPlanContext({
    seedKg: plan.seedKg,
    areaM2: plan.requiredAreaM2,
    rowSpacingCm: checklistRowGap,
    inRowSpacingCm: checklistInRow,
    totalRowLengthM: plan.totalRowLengthM,
  });

  const checklistItems = buildMergedChecklist(
    ctx,
    data.planting.plantingStartDate,
    data.checklistRows ?? [],
  );
  const checklistTotals = phaseTotals(checklistItems);
  const yieldEstimate = estimateYieldFromSeed(data.inventory.totalKg, BOSUT);

  return {
    data: {
      inventory: data.inventory,
      planting: data.planting,
    },
    plan,
    yieldEstimate,
    harvestStats: getHarvestStats(data.harvests, yieldEstimate),
    daysUntilHarvest: getDaysUntilHarvest(data.planting.expectedHarvestDate),
    checklistItems,
    checklistTotals,
    checklistInRow,
    checklistRowGap,
  };
});
