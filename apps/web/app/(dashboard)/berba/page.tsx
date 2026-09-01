import { getDb } from "@/lib/db";
import { getDashboardData } from "@/lib/db/seed";
import { estimateYield, getHarvestStats, getDaysUntilHarvest } from "@/lib/garlic/yield";
import { HarvestForm } from "@/components/HarvestForm";
import { StatCard } from "@/components/StatCard";
import { FieldStatus } from "@/components/field-map/FieldStatus";

export default function BerbaPage() {
  getDb();
  const data = getDashboardData(getDb());

  if (!data?.field || !data.variety || !data.planting) {
    return <p>Nema podataka o berbi.</p>;
  }

  const sector = data.sectors[0];
  if (!sector) {
    return <p>Nema podataka o njivi.</p>;
  }

  const yieldEstimate = estimateYield(data.field.areaM2, {
    id: data.variety.id,
    name: data.variety.name,
    daysToHarvest: data.variety.daysToHarvest,
    spacingCm: data.variety.spacingCm,
    rowSpacingCm: data.variety.rowSpacingCm,
    plantingDepthCm: data.variety.plantingDepthCm,
    yieldMinKgPerHa: data.variety.yieldMinKgPerHa,
    yieldMaxKgPerHa: data.variety.yieldMaxKgPerHa,
    description: data.variety.description,
  });

  const harvestStats = getHarvestStats(data.harvests, yieldEstimate);
  const daysUntil = getDaysUntilHarvest(data.planting.expectedHarvestDate);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-violet-900">Berba i prinos</h1>
        <p className="text-gray-600">
          Očekivana berba: {data.planting.expectedHarvestDate} (za {daysUntil} dana)
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Očekivani prinos"
          value={`${yieldEstimate.avgKg} kg`}
          subtext={`${yieldEstimate.minKg}–${yieldEstimate.maxKg} kg`}
          accent="amber"
        />
        <StatCard
          label="Ubrano do sada"
          value={`${harvestStats.totalHarvested} kg`}
          subtext={`${harvestStats.percentOfExpected}% očekivanog`}
          accent="green"
        />
        <StatCard
          label="Prinos po aru"
          value={`~${yieldEstimate.avgKgPerAr} kg/ar`}
          subtext="Prosek"
          accent="blue"
        />
      </div>

      <HarvestForm sectorId={sector.id} />

      {data.harvests.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Istorija berbe</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Datum</th>
                  <th className="px-4 py-3 text-left">Ubrano (kg)</th>
                </tr>
              </thead>
              <tbody>
                {data.harvests
                  .sort(
                    (a, b) =>
                      new Date(b.harvestedAt).getTime() -
                      new Date(a.harvestedAt).getTime(),
                  )
                  .map((harvest) => (
                    <tr key={harvest.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">{harvest.harvestedAt}</td>
                      <td className="px-4 py-3 font-medium">
                        {harvest.kgHarvested} kg
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

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
