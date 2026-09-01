import { BOSUT, DEFAULT_SEED_KG } from "./varieties";

/** Dužina njive u smeru redova (m). */
export const NJIVA_LENGTH_M = 90;
/** Širina njive — redovi popreko (m). */
export const NJIVA_WIDTH_M = 23;

export type FieldLayout = {
  fieldLengthM: number;
  fieldWidthM: number;
  rowLengthM: number;
  rowCount: number;
  clovesPerRow: number;
  rowsNeeded: number;
  widthUsedM: number;
  widthMarginM: number;
  maxRowsInField: number;
  fitsInField: boolean;
  totalCloves: number;
};

export function layoutForField(
  seedKg: number,
  inRowSpacingCm: number,
  rowSpacingCm: number,
  fieldLengthM = NJIVA_LENGTH_M,
  fieldWidthM = NJIVA_WIDTH_M,
  avgCloveWeightG = BOSUT.avgCloveWeightG,
): FieldLayout {
  const totalCloves = Math.round((seedKg * 1000) / avgCloveWeightG);
  const inRowSpacingM = inRowSpacingCm / 100;
  const rowSpacingM = rowSpacingCm / 100;
  const rowLengthM = fieldLengthM;
  const clovesPerRow = Math.max(1, Math.floor(rowLengthM / inRowSpacingM));
  const rowsNeeded = Math.ceil(totalCloves / clovesPerRow);
  const maxRowsInField = Math.max(1, Math.floor(fieldWidthM / rowSpacingM));
  const rowCount = rowsNeeded;
  const widthUsedM = Math.round(rowCount * rowSpacingM * 10) / 10;
  const widthMarginM = Math.round((fieldWidthM - widthUsedM) * 10) / 10;

  return {
    fieldLengthM,
    fieldWidthM,
    rowLengthM,
    rowCount,
    clovesPerRow,
    rowsNeeded,
    widthUsedM,
    widthMarginM,
    maxRowsInField,
    fitsInField: rowCount <= maxRowsInField,
    totalCloves,
  };
}

export function fieldAreaM2(
  lengthM = NJIVA_LENGTH_M,
  widthM = NJIVA_WIDTH_M,
): number {
  return Math.round(lengthM * widthM);
}

export function fieldAreaAr(
  lengthM = NJIVA_LENGTH_M,
  widthM = NJIVA_WIDTH_M,
): number {
  return Math.round((fieldAreaM2(lengthM, widthM) / 100) * 10) / 10;
}

/** Preporučeni razmak — referentni default ako staje, inače najgušći koji staje. */
export function recommendSpacingForField(
  seedKg = DEFAULT_SEED_KG,
  fieldLengthM = NJIVA_LENGTH_M,
  fieldWidthM = NJIVA_WIDTH_M,
): { inRowSpacingCm: number; rowSpacingCm: number; layout: FieldLayout } {
  const candidates: Array<{ inRow: number; row: number; layout: FieldLayout }> = [];

  for (let inRow = BOSUT.spacingCmMin; inRow <= BOSUT.spacingCmMax; inRow++) {
    for (let row = BOSUT.rowSpacingCmMin; row <= BOSUT.rowSpacingCmMax; row += 5) {
      const layout = layoutForField(seedKg, inRow, row, fieldLengthM, fieldWidthM);
      if (layout.fitsInField) {
        candidates.push({ inRow, row, layout });
      }
    }
  }

  const preferred = candidates.find(
    (c) => c.inRow === BOSUT.spacingCm && c.row === BOSUT.rowSpacingCm,
  );
  if (preferred) {
    return {
      inRowSpacingCm: preferred.inRow,
      rowSpacingCm: preferred.row,
      layout: preferred.layout,
    };
  }

  const fallback = candidates.sort(
    (a, b) => a.layout.widthUsedM - b.layout.widthUsedM,
  )[0];

  if (fallback) {
    return {
      inRowSpacingCm: fallback.inRow,
      rowSpacingCm: fallback.row,
      layout: fallback.layout,
    };
  }

  const layout = layoutForField(
    seedKg,
    BOSUT.spacingCm,
    BOSUT.rowSpacingCm,
    fieldLengthM,
    fieldWidthM,
  );
  return {
    inRowSpacingCm: BOSUT.spacingCm,
    rowSpacingCm: BOSUT.rowSpacingCm,
    layout,
  };
}
