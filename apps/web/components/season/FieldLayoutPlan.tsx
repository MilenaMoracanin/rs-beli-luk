import {
  BOSUT,
  NJIVA_LENGTH_M,
  NJIVA_WIDTH_M,
  recommendSpacingForField,
} from "@beli-luk/shared";
import type { SeedPlantingPlan } from "@/lib/garlic/calculator";

type FieldLayoutPlanProps = {
  plan: SeedPlantingPlan;
  seedKg: number;
  selectedInRow: number;
  selectedRow: number;
};

export function FieldLayoutPlan({
  plan,
  seedKg,
  selectedInRow,
  selectedRow,
}: FieldLayoutPlanProps) {
  const recommendation = recommendSpacingForField(
    seedKg,
    plan.fieldLengthM,
    plan.fieldWidthM,
  );
  const matchesRecommendation =
    selectedInRow === recommendation.inRowSpacingCm &&
    selectedRow === recommendation.rowSpacingCm;

  return (
    <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
      <h2 className="text-lg font-semibold text-emerald-900">Raspored sadnje na njivi</h2>
      <p className="mt-1 text-sm text-emerald-800">
        Njiva {plan.fieldLengthM}×{plan.fieldWidthM} m ({plan.fieldAreaAr} ari) — redovi idu celom
        dužinom od {plan.fieldLengthM} m, koliko redova je potrebno za {seedKg} kg sada.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-emerald-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Plan</p>
          <p className="mt-1 text-xl font-bold text-emerald-950">
            {plan.rowCount} × {plan.rowLengthM} m
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {plan.totalCloves.toLocaleString("sr-RS")} čenova · ~{plan.clovesPerRow}/red
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Razmak</p>
          <p className="mt-1 text-xl font-bold text-emerald-950">
            {selectedInRow} × {selectedRow} cm
          </p>
          <p className="mt-1 text-sm text-gray-600">u redu × između redova</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Širina</p>
          <p className="mt-1 text-xl font-bold text-emerald-950">
            {plan.widthUsedM} / {plan.fieldWidthM} m
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {plan.widthMarginM > 0
              ? `rezerva ${plan.widthMarginM} m`
              : "puna širina"}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Iskorišćenje
          </p>
          <p className="mt-1 text-xl font-bold text-emerald-950">
            {plan.areaUtilizationPercent}%
          </p>
          <p className="mt-1 text-sm text-gray-600">površine njive</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-emerald-300 bg-white p-4 text-sm text-emerald-900">
        <p className="font-semibold">Preporuka</p>
        <p className="mt-1">
          {matchesRecommendation ? (
            <>
              Trenutni razmak {selectedInRow}×{selectedRow} cm odgovara referentnom vodiču i staje
              na njivu: {plan.rowCount} redova dužine {NJIVA_LENGTH_M} m, zauzima{" "}
              {plan.widthUsedM} m širine.
            </>
          ) : (
            <>
              Referentni razmak {recommendation.inRowSpacingCm}×{recommendation.rowSpacingCm} cm:{" "}
              {recommendation.layout.rowCount} redova × {NJIVA_LENGTH_M} m (
              {recommendation.layout.widthUsedM} m širine). Trenutno uneto{" "}
              {selectedInRow}×{selectedRow} cm daje {plan.rowCount} redova.
            </>
          )}
        </p>
      </div>

      <div
        className="mt-4 overflow-hidden rounded-lg border border-emerald-200 bg-white"
        aria-hidden
      >
        <div className="flex">
          <div
            className="relative border-r border-dashed border-emerald-300 bg-emerald-100/80"
            style={{ width: `${Math.min(100, (plan.widthUsedM / plan.fieldWidthM) * 100)}%` }}
          >
            <div className="px-3 py-6 text-center text-xs font-medium text-emerald-800">
              {plan.rowCount} redova × {plan.rowLengthM} m
              <br />
              {plan.widthUsedM} m
            </div>
          </div>
          {plan.widthMarginM > 0 && (
            <div className="flex-1 px-3 py-6 text-center text-xs text-gray-400">
              rezerva {plan.widthMarginM} m
            </div>
          )}
        </div>
        <p className="border-t border-emerald-100 px-3 py-1 text-center text-[10px] text-gray-500">
          {plan.fieldLengthM} m dužina reda → · ← {plan.fieldWidthM} m širina njive
        </p>
      </div>
    </section>
  );
}
