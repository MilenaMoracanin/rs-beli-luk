import { addDays, formatISO } from "date-fns";
import {
  BOSUT,
  CHECKLIST_TEMPLATES,
  DEFAULT_SEED_KG,
  NJIVA_LENGTH_M,
  NJIVA_WIDTH_M,
  buildPlanContext,
  fieldAreaM2,
  planInputFromVariety,
} from "@beli-luk/shared";
import { calculateSeedPlantingPlan } from "@/lib/garlic/calculator";
import { generateSeasonTasks } from "@/lib/garlic/season";
import { defaultFieldValues } from "@/lib/checklist/build";
import type { SeasonState } from "./types";

export function createDefaultSeasonState(): SeasonState {
  const now = formatISO(new Date(), { representation: "date" });
  const plantingDate = formatISO(addDays(new Date(), 14), { representation: "date" });
  const plan = calculateSeedPlantingPlan(
    planInputFromVariety(DEFAULT_SEED_KG, BOSUT, {
      lengthM: NJIVA_LENGTH_M,
      widthM: NJIVA_WIDTH_M,
    }),
  );
  const areaM2 = fieldAreaM2(NJIVA_LENGTH_M, NJIVA_WIDTH_M);
  const ctx = buildPlanContext({
    seedKg: plan.seedKg,
    areaM2: plan.requiredAreaM2,
    rowSpacingCm: BOSUT.rowSpacingCm,
    inRowSpacingCm: BOSUT.spacingCm,
    totalRowLengthM: plan.totalRowLengthM,
  });

  const expectedHarvestDate = formatISO(
    addDays(new Date(plantingDate), BOSUT.daysToHarvest),
    { representation: "date" },
  );

  const seasonTasks = generateSeasonTasks(new Date(plantingDate), BOSUT);

  return {
    field: {
      id: 1,
      name: `Njiva — Bosut (${DEFAULT_SEED_KG} kg)`,
      widthM: NJIVA_WIDTH_M,
      lengthM: NJIVA_LENGTH_M,
      areaM2,
      createdAt: now,
    },
    sectors: [
      {
        id: 1,
        fieldId: 1,
        name: "Njiva",
        orderIndex: 1,
        widthM: NJIVA_WIDTH_M,
        lengthM: NJIVA_LENGTH_M,
        areaM2,
        rowCount: plan.rowCount,
        rowLengthM: plan.rowLengthM,
        status: "empty",
      },
    ],
    inventory: {
      id: 1,
      fieldId: 1,
      varietyId: BOSUT.id,
      totalKg: DEFAULT_SEED_KG,
      usedKg: 0,
      createdAt: now,
    },
    planting: {
      id: 1,
      fieldId: 1,
      varietyId: BOSUT.id,
      plantingStartDate: plantingDate,
      expectedHarvestDate,
      status: "planning",
    },
    variety: {
      id: BOSUT.id,
      name: BOSUT.name,
      daysToHarvest: BOSUT.daysToHarvest,
      spacingCm: BOSUT.spacingCm,
      rowSpacingCm: BOSUT.rowSpacingCm,
      plantingDepthCm: BOSUT.plantingDepthCm,
      yieldMinKgPerHa: BOSUT.harvestMultiplierMin,
      yieldMaxKgPerHa: BOSUT.harvestMultiplierMax,
      description: BOSUT.description,
    },
    tasks: seasonTasks.map((task, index) => ({
      id: index + 1,
      plantingId: 1,
      sectorId: task.sectorId ?? null,
      phase: task.phase,
      title: task.title,
      description: task.description,
      dueDate: formatISO(task.dueDate, { representation: "date" }),
      completed: false,
      completedAt: null,
    })),
    harvests: [],
    checklistRows: CHECKLIST_TEMPLATES.map((template) => ({
      itemKey: template.key,
      completed: false,
      completedAt: null,
      fieldValues: JSON.stringify(
        defaultFieldValues(template, ctx, plantingDate),
      ),
      estimatedCostRsd: null,
      actualCostRsd: null,
      updatedAt: now,
    })),
    plantingLogs: [],
  };
}
