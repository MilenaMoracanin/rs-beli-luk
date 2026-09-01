import {
  AREA_TABLE_IN_ROW_CM,
  areaArForSpacing,
  buildAreaTable,
  BOSUT,
  NJIVA_LENGTH_M,
  NJIVA_WIDTH_M,
} from "@beli-luk/shared";

type AreaTableProps = {
  seedKg: number;
  selectedInRow?: number;
  selectedRow?: number;
  fieldLengthM?: number;
  fieldWidthM?: number;
};

export function AreaTable({
  seedKg,
  selectedInRow,
  selectedRow,
  fieldLengthM = NJIVA_LENGTH_M,
  fieldWidthM = NJIVA_WIDTH_M,
}: AreaTableProps) {
  const table = buildAreaTable(seedKg, fieldLengthM, fieldWidthM);
  const currentAr =
    selectedInRow && selectedRow
      ? areaArForSpacing(seedKg, selectedInRow, selectedRow)
      : areaArForSpacing(seedKg, BOSUT.spacingCm, BOSUT.rowSpacingCm);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">
        Njiva {fieldLengthM}×{fieldWidthM} m — redovi celom dužinom. Površina za{" "}
        <strong>{seedKg} kg</strong> sada (~{BOSUT.avgCloveWeightG} g po čenu). Trenutni plan:{" "}
        <strong>
          {selectedInRow ?? BOSUT.spacingCm} × {selectedRow ?? BOSUT.rowSpacingCm} cm = {currentAr}{" "}
          ari
        </strong>
        . U tabeli: ari + broj redova / zauzeta širina.
      </div>
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-500">Međuredni ↓ / U redu →</th>
            {AREA_TABLE_IN_ROW_CM.map((cm) => (
              <th key={cm} className="px-3 py-2 text-center font-medium text-gray-700">
                {cm} cm
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr key={row.rowSpacingCm} className="border-t border-gray-100">
              <td className="px-3 py-2 font-medium text-gray-700">{row.rowSpacingCm} cm</td>
              {row.cells.map((cell) => {
                const isSelected =
                  cell.inRowSpacingCm === (selectedInRow ?? BOSUT.spacingCm) &&
                  row.rowSpacingCm === (selectedRow ?? BOSUT.rowSpacingCm);
                const cellClass = !cell.fitsInField
                  ? "bg-red-50 text-red-700 line-through opacity-70"
                  : isSelected
                    ? "bg-emerald-100 font-bold text-emerald-900"
                    : cell.isReferenceRange
                      ? "bg-emerald-50/60 text-emerald-800"
                      : "text-gray-700";

                return (
                  <td
                    key={cell.inRowSpacingCm}
                    className={`px-3 py-2 text-center ${cellClass}`}
                  >
                    <div>{cell.areaAr} ari</div>
                    <div className="text-[11px] opacity-80">
                      {cell.rowsNeeded} r · {cell.widthUsedM} m
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
