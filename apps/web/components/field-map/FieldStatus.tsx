import type { Sector } from "@/lib/db/schema";
import type { SeedPlantingPlan } from "@/lib/garlic/calculator";

const statusConfig = {
  empty: { label: "Nije sadeno", color: "bg-red-100 border-red-300 text-red-800" },
  planting: { label: "Sadnja u toku", color: "bg-amber-100 border-amber-300 text-amber-800" },
  planted: { label: "Sadeno", color: "bg-emerald-100 border-emerald-300 text-emerald-800" },
  harvesting: { label: "Berba u toku", color: "bg-sky-100 border-sky-300 text-sky-800" },
  harvested: { label: "Ubrano", color: "bg-violet-100 border-violet-300 text-violet-800" },
};

type FieldStatusProps = {
  sector: Sector | undefined;
  fieldName: string;
  plan: SeedPlantingPlan;
};

export function FieldStatus({ sector, fieldName, plan }: FieldStatusProps) {
  const config = sector ? statusConfig[sector.status] : statusConfig.empty;

  return (
    <div className={`rounded-xl border-2 p-5 ${config.color}`}>
      <h3 className="text-lg font-bold">{fieldName}</h3>
      <p className="mt-1 text-sm opacity-80">{config.label}</p>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="opacity-70">Glavica</dt>
          <dd className="font-semibold">
            {plan.avgClovesPerBulb} čenova ({plan.bulbWeightGMin}–{plan.bulbWeightGMax} g)
          </dd>
        </div>
        <div>
          <dt className="opacity-70">Sadni materijal</dt>
          <dd className="font-semibold">
            {plan.seedKg} kg · {plan.totalCloves.toLocaleString("sr-RS")} čenova
          </dd>
        </div>
        <div>
          <dt className="opacity-70">Njiva</dt>
          <dd className="font-semibold">
            {plan.fieldLengthM}×{plan.fieldWidthM} m ({plan.fieldAreaAr} ari)
          </dd>
        </div>
        <div>
          <dt className="opacity-70">Raspored</dt>
          <dd className="font-semibold">
            {plan.rowCount} redova × {plan.rowLengthM} m
          </dd>
        </div>
        <div>
          <dt className="opacity-70">Potrebna površina sada</dt>
          <dd className="font-semibold">~{plan.requiredAreaAr} ari ({plan.requiredAreaM2} m²)</dd>
        </div>
        {sector && (
          <>
            <div>
              <dt className="opacity-70">Redovi</dt>
              <dd className="font-semibold">{sector.rowCount}</dd>
            </div>
            <div>
              <dt className="opacity-70">Dužina reda</dt>
              <dd className="font-semibold">{sector.rowLengthM} m</dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
}
