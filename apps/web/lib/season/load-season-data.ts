import {
  calculateSeedPlantingPlan,
  getPlantingProgress,
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
import type { DashboardData, SeasonState } from "./types";

export type SeasonViewModel = {
  data: {
    field: NonNullable<DashboardData["field"]>;
    inventory: NonNullable<DashboardData["inventory"]>;
    planting: NonNullable<DashboardData["planting"]>;
    sectors: DashboardData["sectors"];
    tasks: DashboardData["tasks"];
    harvests: DashboardData["harvests"];
    checklistRows: DashboardData["checklistRows"];
    variety: DashboardData["variety"];
  };
  plan: SeedPlantingPlan;
  progress: ReturnType<typeof getPlantingProgress>;
  yieldEstimate: YieldEstimate;
  harvestStats: ReturnType<typeof getHarvestStats>;
  daysUntilHarvest: number;
  checklistItems: Array<ChecklistItemState & { template: ChecklistItemTemplate }>;
  checklistTotals: Record<string, number>;
  checklistInRow: number;
  checklistRowGap: number;
  plantingLogs: SeasonState["plantingLogs"];
};

export function buildSeasonViewModel(state: SeasonState): SeasonViewModel {
  const data: DashboardData = {
    field: state.field,
    sectors: state.sectors,
    inventory: state.inventory,
    planting: state.planting,
    variety: state.variety,
    tasks: state.tasks,
    harvests: state.harvests,
    checklistRows: state.checklistRows,
  };

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
    data.checklistRows,
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
    data.checklistRows,
  );
  const checklistTotals = phaseTotals(checklistItems);
  const yieldEstimate = estimateYieldFromSeed(data.inventory.totalKg, BOSUT);

  return {
    data,
    plan,
    progress: getPlantingProgress(data.inventory.totalKg, data.inventory.usedKg),
    yieldEstimate,
    harvestStats: getHarvestStats(data.harvests, yieldEstimate),
    daysUntilHarvest: getDaysUntilHarvest(data.planting.expectedHarvestDate),
    checklistItems,
    checklistTotals,
    checklistInRow,
    checklistRowGap,
    plantingLogs: state.plantingLogs,
  };
}
