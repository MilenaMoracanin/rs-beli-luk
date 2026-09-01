import type { ChecklistCostCalc } from "./types";

function parseNum(value: string | undefined): number {
  if (value == null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Ukupna cena stavke — samo iz korisničkih unosa, bez fiksnih procena. */
export function computeItemCost(
  calc: ChecklistCostCalc,
  fieldValues: Record<string, string>,
): number {
  let total = 0;

  for (const line of calc.lines) {
    if (line.type === "field") {
      total += parseNum(fieldValues[line.key]);
    } else if (line.type === "product") {
      total += parseNum(fieldValues[line.unitKey]) * parseNum(fieldValues[line.qtyKey]);
    } else if (line.type === "product_scaled") {
      const qty = parseNum(fieldValues[line.qtyKey]);
      total += parseNum(fieldValues[line.unitKey]) * (qty / line.divisor);
    }
  }

  return Math.round(total);
}

export function hasCostInputs(
  calc: ChecklistCostCalc,
  fieldValues: Record<string, string>,
): boolean {
  for (const line of calc.lines) {
    if (line.type === "field" && fieldValues[line.key]?.trim()) return true;
    if (line.type === "product" || line.type === "product_scaled") {
      if (fieldValues[line.unitKey]?.trim()) return true;
    }
  }
  return false;
}

export function formatRsd(amount: number): string {
  if (amount <= 0) return "—";
  return `${Math.round(amount).toLocaleString("sr-RS")} RSD`;
}

export function buildPlanContext(input: {
  seedKg: number;
  areaM2: number;
  rowSpacingCm: number;
  inRowSpacingCm: number;
  totalRowLengthM: number;
  npkKgPerHa?: number;
}) {
  const areaAr = Math.round((input.areaM2 / 100) * 10) / 10;
  const areaHa = Math.round((input.areaM2 / 10000) * 1000) / 1000;
  const npkKg = Math.round((input.npkKgPerHa ?? 450) * areaHa);

  return {
    seedKg: input.seedKg,
    areaM2: input.areaM2,
    areaAr,
    areaHa,
    rowSpacingCm: input.rowSpacingCm,
    inRowSpacingCm: input.inRowSpacingCm,
    totalRowLengthM: input.totalRowLengthM,
    dripLengthM: input.totalRowLengthM,
    npkKg,
  };
}

export type ChecklistPlanContext = ReturnType<typeof buildPlanContext>;

export type AutoFieldKey =
  | "area_ar"
  | "area_m2"
  | "area_ha"
  | "drip_length_m"
  | "npk_kg"
  | "seed_kg";

export function resolveAutoField(key: AutoFieldKey, ctx: ChecklistPlanContext): string {
  switch (key) {
    case "area_ar":
      return String(ctx.areaAr);
    case "area_m2":
      return String(ctx.areaM2);
    case "area_ha":
      return String(ctx.areaHa);
    case "drip_length_m":
      return String(ctx.dripLengthM);
    case "npk_kg":
      return String(ctx.npkKg);
    case "seed_kg":
      return String(ctx.seedKg);
    default:
      return "";
  }
}
