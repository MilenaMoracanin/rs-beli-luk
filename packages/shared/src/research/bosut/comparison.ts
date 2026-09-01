import { BOSUT_SOURCES } from "./sources";
import type { ClaimCategory, MetricComparison, NumericRange, ResearchClaim } from "./types";

function formatValue(value: ResearchClaim["value"]): string {
  if (typeof value === "string") return value;
  if (value.value !== undefined) return `${value.value}${value.unit ? ` ${value.unit}` : ""}`;
  if (value.min !== undefined && value.max !== undefined) {
    return `${value.min}–${value.max}${value.unit ? ` ${value.unit}` : ""}`;
  }
  if (value.min !== undefined) return `≥${value.min}${value.unit ? ` ${value.unit}` : ""}`;
  if (value.max !== undefined) return `≤${value.max}${value.unit ? ` ${value.unit}` : ""}`;
  return JSON.stringify(value);
}

function valuesConflict(values: string[]): boolean {
  const normalized = values.map((v) => v.toLowerCase().replace(/\s+/g, " "));
  return new Set(normalized).size > 1;
}

export function buildMetricComparisons(): MetricComparison[] {
  const byAttribute = new Map<string, MetricComparison>();

  for (const source of BOSUT_SOURCES) {
    for (const claim of source.claims) {
      const key = `${claim.category}::${claim.attribute}`;
      const formatted = formatValue(claim.value);

      if (!byAttribute.has(key)) {
        byAttribute.set(key, {
          attribute: claim.attribute,
          category: claim.category,
          unit: typeof claim.value === "object" ? claim.value.unit : undefined,
          entries: [],
          hasConflict: false,
        });
      }

      const metric = byAttribute.get(key)!;
      metric.entries.push({
        sourceId: source.id,
        sourceTitle: source.title,
        value: formatted,
        rawText: claim.rawText,
      });
    }
  }

  const comparisons = Array.from(byAttribute.values());
  for (const metric of comparisons) {
    metric.hasConflict = valuesConflict(metric.entries.map((e) => e.value));
  }

  return comparisons.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.attribute.localeCompare(b.attribute);
  });
}

export function getConflictingMetrics(): MetricComparison[] {
  return buildMetricComparisons().filter((m) => m.hasConflict);
}

export function getMetricsByCategory(category: ClaimCategory): MetricComparison[] {
  return buildMetricComparisons().filter((m) => m.category === category);
}

export function estimateYieldKgPerHa(prinosKg: number, areaM2: number): number {
  return Math.round((prinosKg / areaM2) * 10000);
}

/** Izračunati ekvivalenti prinosa iz prakse */
export const YIELD_BENCHMARKS = [
  {
    label: "Dr Gvozdenović Varga (AgroSmart)",
    kgPerHa: 11000,
    range: { min: 10000, max: 12000 } as NumericRange,
    sourceId: "agrosmart-2016",
  },
  {
    label: "Semenska proizvodnja Zmajevo (Agro Info Net)",
    kgPerHa: 9000,
    sourceId: "agroinfonet",
  },
  {
    label: "Bašta 6×25 m, Banatski Dvor",
    kgPerHa: estimateYieldKgPerHa(160, 150),
    sourceId: "plodna-zemlja-tatjana",
  },
  {
    label: "Ogled Arilje — Bosut (Totić & Čanak, ekstrapolacija ~64 m²)",
    kgPerHa: estimateYieldKgPerHa(87.6, 64),
    sourceId: "totic-canak-2014",
  },
  {
    label: "Ogled Novi Pazar — Bosut (ekstrapolacija ~80 m²)",
    kgPerHa: estimateYieldKgPerHa(89.2, 80),
    sourceId: "totic-canak-2014",
  },
] as const;

export const BOSUT_SOURCE_COUNT = BOSUT_SOURCES.length;
export const BOSUT_CLAIM_COUNT = BOSUT_SOURCES.reduce(
  (sum, s) => sum + s.claims.length,
  0,
);
