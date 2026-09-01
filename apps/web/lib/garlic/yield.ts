import type { GarlicVariety } from "@beli-luk/shared";

export type YieldEstimate = {
  minKg: number;
  maxKg: number;
  avgKg: number;
  /** kg prinosa po kg sadnog materijala */
  minKgPerSeedKg: number;
  maxKgPerSeedKg: number;
  avgKgPerSeedKg: number;
};

export function estimateYieldFromSeed(
  seedKg: number,
  variety: GarlicVariety,
): YieldEstimate {
  const minKg = Math.round(seedKg * variety.harvestMultiplierMin);
  const maxKg = Math.round(seedKg * variety.harvestMultiplierMax);
  const avgKg = Math.round((minKg + maxKg) / 2);

  return {
    minKg,
    maxKg,
    avgKg,
    minKgPerSeedKg: variety.harvestMultiplierMin,
    maxKgPerSeedKg: variety.harvestMultiplierMax,
    avgKgPerSeedKg: Math.round(((minKg + maxKg) / 2 / seedKg) * 10) / 10,
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
