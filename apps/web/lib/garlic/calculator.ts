import { layoutForField } from "@beli-luk/shared";

export type SeedPlantingPlanInput = {
  seedKg: number;
  avgCloveWeightG: number;
  avgClovesPerBulb?: number;
  bulbWeightGMin?: number;
  bulbWeightGMax?: number;
  rowSpacingCm: number;
  inRowSpacingCm: number;
  /** Dužina njive u smeru redova (m) — red ide celom dužinom */
  fieldLengthM?: number;
  /** Širina njive popreko redova (m) */
  fieldWidthM?: number;
};

export type SeedPlantingPlan = {
  seedKg: number;
  totalCloves: number;
  estimatedBulbs: number;
  avgCloveWeightG: number;
  avgClovesPerBulb: number;
  bulbWeightGMin: number;
  bulbWeightGMax: number;
  plantsPerM2: number;
  requiredAreaM2: number;
  requiredAreaAr: number;
  rowCount: number;
  clovesPerRow: number;
  rowLengthM: number;
  totalRowLengthM: number;
  fieldLengthM: number;
  fieldWidthM: number;
  fieldAreaM2: number;
  fieldAreaAr: number;
  widthUsedM: number;
  widthMarginM: number;
  maxRowsInField: number;
  areaUtilizationPercent: number;
  warnings: string[];
};

export function calculateSeedPlantingPlan(
  input: SeedPlantingPlanInput,
): SeedPlantingPlan {
  const {
    seedKg,
    avgCloveWeightG,
    avgClovesPerBulb = 9.5,
    bulbWeightGMin = 35,
    bulbWeightGMax = 60,
    rowSpacingCm,
    inRowSpacingCm,
    fieldLengthM = 90,
    fieldWidthM = 23,
  } = input;

  const layout = layoutForField(
    seedKg,
    inRowSpacingCm,
    rowSpacingCm,
    fieldLengthM,
    fieldWidthM,
    avgCloveWeightG,
  );

  const rowSpacingM = rowSpacingCm / 100;
  const inRowSpacingM = inRowSpacingCm / 100;
  const plantsPerM2 = 1 / (rowSpacingM * inRowSpacingM);
  const requiredAreaM2 = Math.round(layout.totalCloves / plantsPerM2);
  const requiredAreaAr = Math.round((requiredAreaM2 / 100) * 10) / 10;
  const fieldAreaM2 = Math.round(fieldLengthM * fieldWidthM);
  const fieldAreaAr = Math.round((fieldAreaM2 / 100) * 10) / 10;
  const usedAreaM2 = Math.round(layout.widthUsedM * fieldLengthM);
  const areaUtilizationPercent =
    fieldAreaM2 > 0 ? Math.round((usedAreaM2 / fieldAreaM2) * 100) : 0;
  const estimatedBulbs = Math.round(layout.totalCloves / avgClovesPerBulb);
  const totalRowLengthM = Math.round(layout.rowCount * layout.rowLengthM);

  const warnings: string[] = [];
  if (avgCloveWeightG < 4) {
    warnings.push(
      "Masa čena ispod 4 g — proverite da li su čenovi dovoljno krupni za sadnju.",
    );
  }

  if (!layout.fitsInField) {
    warnings.push(
      `Za ${seedKg} kg sada potrebno je ${layout.rowCount} redova (širina ${layout.widthUsedM} m), a na njivi ${fieldLengthM}×${fieldWidthM} m pri razmaku ${rowSpacingCm} cm staje najviše ${layout.maxRowsInField} redova. Smanjite razmak između redova ili u redu.`,
    );
  } else if (layout.widthMarginM >= 5) {
    warnings.push(
      `100 kg staje u ${layout.rowCount} redova dužine ${fieldLengthM} m (zauzeto ${layout.widthUsedM} m od ${fieldWidthM} m širine) — ostaje rezerva za pristupne puteve ili kasnije proširenje.`,
    );
  }

  return {
    seedKg,
    totalCloves: layout.totalCloves,
    estimatedBulbs,
    avgCloveWeightG,
    avgClovesPerBulb,
    bulbWeightGMin,
    bulbWeightGMax,
    plantsPerM2: Math.round(plantsPerM2 * 10) / 10,
    requiredAreaM2,
    requiredAreaAr,
    rowCount: layout.rowCount,
    clovesPerRow: layout.clovesPerRow,
    rowLengthM: layout.rowLengthM,
    totalRowLengthM,
    fieldLengthM,
    fieldWidthM,
    fieldAreaM2,
    fieldAreaAr,
    widthUsedM: layout.widthUsedM,
    widthMarginM: layout.widthMarginM,
    maxRowsInField: layout.maxRowsInField,
    areaUtilizationPercent,
    warnings,
  };
}
