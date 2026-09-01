export type PlantingPlanInput = {
  seedKg: number;
  avgCloveWeightG: number;
  rowSpacingCm: number;
  inRowSpacingCm: number;
  fieldAreaM2: number;
  fieldWidthM: number;
  fieldLengthM: number;
  sectorCount: number;
};

export type SectorPlan = {
  name: string;
  orderIndex: number;
  areaM2: number;
  rowCount: number;
  rowLengthM: number;
  estimatedCloves: number;
  estimatedSeedKg: number;
};

export type PlantingPlan = {
  totalCloves: number;
  totalRows: number;
  totalRowLengthM: number;
  plantsPerM2: number;
  areaUsedM2: number;
  areaUtilizationPercent: number;
  sectors: SectorPlan[];
  warnings: string[];
};

export function calculatePlantingPlan(input: PlantingPlanInput): PlantingPlan {
  const {
    seedKg,
    avgCloveWeightG,
    rowSpacingCm,
    inRowSpacingCm,
    fieldAreaM2,
    fieldWidthM,
    fieldLengthM,
    sectorCount,
  } = input;

  const totalCloves = Math.round((seedKg * 1000) / avgCloveWeightG);
  const rowSpacingM = rowSpacingCm / 100;
  const inRowSpacingM = inRowSpacingCm / 100;

  const rowsAcrossWidth = Math.floor(fieldWidthM / rowSpacingM);
  const clovesPerRow = Math.floor(fieldLengthM / inRowSpacingM);
  const maxClovesOnField = rowsAcrossWidth * clovesPerRow;
  const maxRows = rowsAcrossWidth;

  const totalRows = Math.min(
    maxRows,
    Math.ceil(totalCloves / Math.max(clovesPerRow, 1)),
  );
  const totalRowLengthM = totalRows * fieldLengthM;
  const areaUsedM2 = totalRows * rowSpacingM * fieldLengthM;
  const plantsPerM2 = totalCloves / fieldAreaM2;

  const warnings: string[] = [];
  if (totalCloves > maxClovesOnField) {
    warnings.push(
      `Upozorenje: ${totalCloves.toLocaleString("sr-RS")} čenova ne staje na njivu. Maksimum: ${maxClovesOnField.toLocaleString("sr-RS")}.`,
    );
  }
  if (areaUsedM2 > fieldAreaM2 * 1.05) {
    warnings.push("Planirana gustoća premašuje površinu od 10 ari.");
  }

  const sectorAreaM2 = fieldAreaM2 / sectorCount;
  const rowsPerSector = Math.ceil(totalRows / sectorCount);
  const clovesPerSector = Math.round(totalCloves / sectorCount);
  const seedKgPerSector = seedKg / sectorCount;

  const sectors: SectorPlan[] = Array.from({ length: sectorCount }, (_, i) => ({
    name: sectorCount === 1 ? "Njiva" : `Parcela ${i + 1}`,
    orderIndex: i + 1,
    areaM2: Math.round(sectorCount === 1 ? fieldAreaM2 : sectorAreaM2),
    rowCount: sectorCount === 1 ? totalRows : rowsPerSector,
    rowLengthM: fieldLengthM,
    estimatedCloves: sectorCount === 1 ? totalCloves : clovesPerSector,
    estimatedSeedKg:
      sectorCount === 1 ? seedKg : Math.round(seedKgPerSector * 10) / 10,
  }));

  return {
    totalCloves,
    totalRows,
    totalRowLengthM: Math.round(totalRowLengthM),
    plantsPerM2: Math.round(plantsPerM2 * 10) / 10,
    areaUsedM2: Math.round(areaUsedM2),
    areaUtilizationPercent: Math.round((areaUsedM2 / fieldAreaM2) * 100),
    sectors,
    warnings,
  };
}

export function getPlantingProgress(totalKg: number, usedKg: number) {
  const remainingKg = Math.max(totalKg - usedKg, 0);
  const percentComplete =
    totalKg > 0 ? Math.round((usedKg / totalKg) * 100) : 0;

  return {
    totalKg,
    usedKg,
    remainingKg: Math.round(remainingKg * 10) / 10,
    percentComplete,
  };
}
