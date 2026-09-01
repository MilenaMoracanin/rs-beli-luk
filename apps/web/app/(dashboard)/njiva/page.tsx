import { getDb } from "@/lib/db";
import { getDashboardData } from "@/lib/db/seed";
import { calculatePlantingPlan } from "@/lib/garlic/calculator";
import { FieldStatus } from "@/components/field-map/FieldStatus";
import { StatCard } from "@/components/StatCard";

export default function NjivaPage() {
  getDb();
  const data = getDashboardData(getDb());

  if (!data?.field || !data.variety || !data.inventory) {
    return <p>Nema podataka o njivi.</p>;
  }

  const sector = data.sectors[0];

  const plan = calculatePlantingPlan({
    seedKg: data.inventory.totalKg,
    avgCloveWeightG: 3,
    rowSpacingCm: data.variety.rowSpacingCm,
    inRowSpacingCm: data.variety.spacingCm,
    fieldAreaM2: data.field.areaM2,
    fieldWidthM: data.field.widthM,
    fieldLengthM: data.field.lengthM,
    sectorCount: 1,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-emerald-900">Njiva — 10 ari</h1>
        <p className="text-gray-600">
          {data.field.widthM}×{data.field.lengthM} m = {data.field.areaM2} m²
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ukupno čenova"
          value={plan.totalCloves.toLocaleString("sr-RS")}
          subtext={`~${plan.plantsPerM2} po m²`}
        />
        <StatCard
          label="Redova"
          value={String(plan.totalRows)}
          subtext={`${plan.totalRowLengthM} m ukupno`}
          accent="blue"
        />
        <StatCard
          label="Iskorišćenost"
          value={`${plan.areaUtilizationPercent}%`}
          subtext={`${plan.areaUsedM2} m² zasađeno`}
          accent="amber"
        />
        <StatCard
          label="Sadni materijal"
          value={`${data.inventory.totalKg} kg`}
          subtext={data.variety.name}
          accent="purple"
        />
      </div>

      {plan.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <h3 className="font-semibold text-amber-900">Upozorenja</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-amber-800">
            {plan.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">Plan sadnje</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div>
              <dt className="text-gray-500">Razmak u redu</dt>
              <dd className="font-semibold">{data.variety.spacingCm} cm</dd>
            </div>
            <div>
              <dt className="text-gray-500">Razmak između redova</dt>
              <dd className="font-semibold">{data.variety.rowSpacingCm} cm</dd>
            </div>
            <div>
              <dt className="text-gray-500">Dubina sadnje</dt>
              <dd className="font-semibold">{data.variety.plantingDepthCm} cm</dd>
            </div>
            <div>
              <dt className="text-gray-500">Čenova po redu</dt>
              <dd className="font-semibold">
                {Math.floor(data.field.lengthM / (data.variety.spacingCm / 100)).toLocaleString("sr-RS")}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Status njive</h2>
        <FieldStatus
          sector={sector}
          fieldName={data.field.name}
          areaM2={data.field.areaM2}
        />
      </section>
    </div>
  );
}
