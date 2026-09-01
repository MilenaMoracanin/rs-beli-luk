import { BOSUT, DEFAULT_SEED_KG } from "../varieties";
import { layoutForField, NJIVA_LENGTH_M, NJIVA_WIDTH_M } from "../field";

/** Površina u arima za zadatu količinu sada i razmake (formula iz kalkulatora). */
export function areaArForSpacing(
  seedKg: number,
  inRowSpacingCm: number,
  rowSpacingCm: number,
  avgCloveWeightG = BOSUT.avgCloveWeightG,
): number {
  const totalCloves = (seedKg * 1000) / avgCloveWeightG;
  const areaM2 = totalCloves * (inRowSpacingCm / 100) * (rowSpacingCm / 100);
  return Math.round((areaM2 / 100) * 10) / 10;
}

export const AREA_TABLE_IN_ROW_CM = [12, 13, 14, 15] as const;
export const AREA_TABLE_ROW_SPACING_CM = [30, 35, 40, 45, 50] as const;

export function buildAreaTable(
  seedKg = DEFAULT_SEED_KG,
  fieldLengthM = NJIVA_LENGTH_M,
  fieldWidthM = NJIVA_WIDTH_M,
) {
  return AREA_TABLE_ROW_SPACING_CM.map((rowCm) => ({
    rowSpacingCm: rowCm,
    cells: AREA_TABLE_IN_ROW_CM.map((inRowCm) => {
      const layout = layoutForField(
        seedKg,
        inRowCm,
        rowCm,
        fieldLengthM,
        fieldWidthM,
      );
      return {
        inRowSpacingCm: inRowCm,
        areaAr: areaArForSpacing(seedKg, inRowCm, rowCm),
        rowsNeeded: layout.rowCount,
        widthUsedM: layout.widthUsedM,
        fitsInField: layout.fitsInField,
        isReferenceDefault:
          inRowCm === BOSUT.spacingCm && rowCm === BOSUT.rowSpacingCm,
        isReferenceRange:
          inRowCm >= BOSUT.spacingCmMin &&
          inRowCm <= BOSUT.spacingCmMax &&
          rowCm >= BOSUT.rowSpacingCmMin &&
          rowCm <= BOSUT.rowSpacingCmMax,
      };
    }),
  }));
}
