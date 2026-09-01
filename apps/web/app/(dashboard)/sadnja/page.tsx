import { getDb } from "@/lib/db";
import { getDashboardData } from "@/lib/db/seed";
import { getPlantingProgress } from "@/lib/garlic/calculator";
import { getPlantingLogs } from "@/lib/actions";
import { PlantingProgress } from "@/components/planting-progress/PlantingProgress";
import { PlantingLogForm } from "@/components/PlantingLogForm";
import { FieldStatus } from "@/components/field-map/FieldStatus";

export default async function SadnjaPage() {
  getDb();
  const data = getDashboardData(getDb());
  const logs = await getPlantingLogs();

  if (!data?.inventory) {
    return <p>Nema podataka o sadnji.</p>;
  }

  const sector = data.sectors[0];
  if (!sector) {
    return <p>Nema podataka o njivi.</p>;
  }

  const progress = getPlantingProgress(
    data.inventory.totalKg,
    data.inventory.usedKg,
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-emerald-900">Sadnja</h1>
        <p className="text-gray-600">
          Praćenje sadnje — {data.inventory.totalKg} kg sadnog materijala
        </p>
      </header>

      <PlantingProgress {...progress} />

      <PlantingLogForm sectorId={sector.id} />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Dnevni log rada</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">Još nema unosa sadnje.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Datum</th>
                  <th className="px-4 py-3 text-left">Kg</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{log.plantedAt}</td>
                    <td className="px-4 py-3">{log.kgPlanted} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Status njive</h2>
        <FieldStatus
          sector={sector}
          fieldName={data.field?.name ?? "Njiva"}
          areaM2={data.field?.areaM2 ?? 1000}
        />
      </section>
    </div>
  );
}
