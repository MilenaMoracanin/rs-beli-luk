import { getDb } from "@/lib/db";
import { getDashboardData } from "@/lib/db/seed";
import { calculatePlantingPlan, getPlantingProgress } from "@/lib/garlic/calculator";
import { getTodaysTasks } from "@/lib/garlic/season";
import { estimateYield, getDaysUntilHarvest } from "@/lib/garlic/yield";
import { fetchJakovoWeatherForecast } from "@/lib/weather";
import { StatCard } from "@/components/StatCard";
import { FieldStatus } from "@/components/field-map/FieldStatus";
import { PlantingProgress } from "@/components/planting-progress/PlantingProgress";
import { TaskList } from "@/components/TaskList";
import { WeatherWidget } from "@/components/WeatherWidget";

export default async function DashboardPage() {
  getDb();
  const data = getDashboardData(getDb());

  if (!data?.field || !data.inventory || !data.planting || !data.variety) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h1 className="text-xl font-bold text-amber-900">Nema podataka</h1>
        <p className="mt-2 text-amber-800">
          Pokrenite aplikaciju ponovo da se inicijalizuje baza.
        </p>
      </div>
    );
  }

  const sector = data.sectors[0];

  const progress = getPlantingProgress(
    data.inventory.totalKg,
    data.inventory.usedKg,
  );

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

  const daysUntilHarvest = getDaysUntilHarvest(data.planting.expectedHarvestDate);
  const todaysTasks = getTodaysTasks(data.tasks);

  let weather = null;
  try {
    weather = await fetchJakovoWeatherForecast();
  } catch {
    weather = null;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-emerald-900">
          {data.field.name}
        </h1>
        <p className="text-gray-600">
          {data.variety.name} · Sezona {data.planting.plantingStartDate} — berba{" "}
          {data.planting.expectedHarvestDate}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Sadni materijal"
          value={`${progress.usedKg}/${progress.totalKg} kg`}
          subtext={`${progress.percentComplete}% završeno`}
          accent="green"
        />
        <StatCard
          label="Površina"
          value="10 ari"
          subtext={`${data.field.areaM2} m² · ${plan.totalCloves.toLocaleString("sr-RS")} čenova`}
          accent="blue"
        />
        <StatCard
          label="Očekivani prinos"
          value={`${yieldEstimate.minKg}–${yieldEstimate.maxKg} kg`}
          subtext={`~${yieldEstimate.avgKgPerAr} kg/ar`}
          accent="amber"
        />
        <StatCard
          label="Dana do berbe"
          value={String(daysUntilHarvest)}
          subtext={data.planting.expectedHarvestDate}
          accent="purple"
        />
      </div>

      <PlantingProgress {...progress} />

      {weather && (
        <WeatherWidget
          days={weather.days}
          irrigationRecommendation={weather.irrigationRecommendation}
        />
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Današnji zadaci ({todaysTasks.length})
        </h2>
        <TaskList tasks={todaysTasks.length > 0 ? todaysTasks : data.tasks.slice(0, 5)} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Status njive
        </h2>
        <FieldStatus
          sector={sector}
          fieldName={data.field.name}
          areaM2={data.field.areaM2}
        />
      </section>
    </div>
  );
}
