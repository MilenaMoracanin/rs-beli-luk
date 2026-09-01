import type { GarlicVariety } from "@beli-luk/shared";

export type YieldEstimate = {
  minKg: number;
  maxKg: number;
  avgKg: number;
  minKgPerAr: number;
  maxKgPerAr: number;
  avgKgPerAr: number;
};

export function estimateYield(
  areaM2: number,
  variety: GarlicVariety,
): YieldEstimate {
  const areaHa = areaM2 / 10000;
  const minKg = Math.round(variety.yieldMinKgPerHa * areaHa);
  const maxKg = Math.round(variety.yieldMaxKgPerHa * areaHa);
  const avgKg = Math.round((minKg + maxKg) / 2);
  const areaAr = areaM2 / 100;

  return {
    minKg,
    maxKg,
    avgKg,
    minKgPerAr: Math.round(minKg / areaAr),
    maxKgPerAr: Math.round(maxKg / areaAr),
    avgKgPerAr: Math.round(avgKg / areaAr),
  };
}

export function getHarvestStats(
  harvests: { kgHarvested: number }[],
  estimate: YieldEstimate,
) {
  const totalHarvested = harvests.reduce((sum, h) => sum + h.kgHarvested, 0);
  const percentOfExpected =
    estimate.avgKg > 0
      ? Math.round((totalHarvested / estimate.avgKg) * 100)
      : 0;

  return {
    totalHarvested: Math.round(totalHarvested * 10) / 10,
    percentOfExpected,
    remainingEstimate: Math.max(estimate.avgKg - totalHarvested, 0),
  };
}

export function getDaysUntilHarvest(expectedHarvestDate: string): number {
  const now = new Date();
  const harvest = new Date(expectedHarvestDate);
  const diff = harvest.getTime() - now.getTime();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
}
