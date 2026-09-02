export type GarlicVariety = {
  id: string;
  name: string;
  daysToHarvest: number;
  /** Razmak u redu (referentni vodič: 12–15 cm) */
  spacingCmMin: number;
  spacingCmMax: number;
  /** Planiranje — sredina opsega */
  spacingCm: number;
  /** Razmak između redova (referentni vodič: 30–50 cm) */
  rowSpacingCmMin: number;
  rowSpacingCmMax: number;
  rowSpacingCm: number;
  plantingDepthCmMin: number;
  plantingDepthCmMax: number;
  plantingDepthCm: number;
  plantingWindowStart: string;
  plantingWindowEnd: string;
  bulbWeightGMin: number;
  bulbWeightGMax: number;
  avgClovesPerBulbMin: number;
  avgClovesPerBulbMax: number;
  avgCloveWeightG: number;
  harvestMultiplierMin: number;
  harvestMultiplierMax: number;
  description: string;
};

export const BOSUT: GarlicVariety = {
  id: "bosut",
  name: "Bosut",
  daysToHarvest: 270,
  spacingCmMin: 12,
  spacingCmMax: 15,
  spacingCm: 14,
  rowSpacingCmMin: 30,
  rowSpacingCmMax: 50,
  rowSpacingCm: 40,
  plantingDepthCmMin: 2,
  plantingDepthCmMax: 3,
  plantingDepthCm: 3,
  plantingWindowStart: "05.10.",
  plantingWindowEnd: "25.10.",
  bulbWeightGMin: 35,
  bulbWeightGMax: 60,
  avgClovesPerBulbMin: 9,
  avgClovesPerBulbMax: 10,
  avgCloveWeightG: 8,
  harvestMultiplierMin: 7,
  harvestMultiplierMax: 10,
  description:
    "Jesenja sorta Bosut — referentni vodič: sadnja 5–25.10., razmak 12–15 × 30–50 cm, dubina 2–3 cm.",
};

export const GARLIC_VARIETIES: GarlicVariety[] = [BOSUT];

export const DEFAULT_SEED_KG = 100;

export function planInputFromVariety(
  seedKg: number,
  variety: GarlicVariety,
  field?: { lengthM: number; widthM: number },
) {
  return {
    seedKg,
    avgCloveWeightG: variety.avgCloveWeightG,
    avgClovesPerBulb:
      (variety.avgClovesPerBulbMin + variety.avgClovesPerBulbMax) / 2,
    bulbWeightGMin: variety.bulbWeightGMin,
    bulbWeightGMax: variety.bulbWeightGMax,
    rowSpacingCm: variety.rowSpacingCm,
    inRowSpacingCm: variety.spacingCm,
    fieldLengthM: field?.lengthM,
    fieldWidthM: field?.widthM,
  };
}
