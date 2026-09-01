import { getDb } from "@/lib/db";
import { getDashboardData } from "@/lib/db/seed";
import { getUpcomingTasks } from "@/lib/garlic/season";
import { fetchJakovoWeatherForecast } from "@/lib/weather";
import { TaskList } from "@/components/TaskList";
import { WeatherWidget } from "@/components/WeatherWidget";

export default async function KalendarPage() {
  getDb();
  const data = getDashboardData(getDb());

  if (!data?.tasks || !data.planting) {
    return <p>Nema podataka o kalendaru.</p>;
  }

  const upcoming = getUpcomingTasks(data.tasks, 30);
  const completed = data.tasks.filter((t) => t.completed).length;
  const total = data.tasks.length;

  let weather = null;
  try {
    weather = await fetchJakovoWeatherForecast();
  } catch {
    weather = null;
  }

  const phases = ["planting", "maintenance", "harvest", "storage"] as const;
  const phaseLabels = {
    planting: "Sadnja",
    maintenance: "Održavanje",
    harvest: "Berba",
    storage: "Sušenje i skladištenje",
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-emerald-900">Kalendar zadataka</h1>
        <p className="text-gray-600">
          Sezona {data.planting.plantingStartDate} — {completed}/{total} završeno
        </p>
      </header>

      {weather && (
        <WeatherWidget
          days={weather.days}
          irrigationRecommendation={weather.irrigationRecommendation}
        />
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Predstojeći zadaci (30 dana)
        </h2>
        <TaskList tasks={upcoming.length > 0 ? upcoming : data.tasks} showAll />
      </section>

      {phases.map((phase) => {
        const phaseTasks = data.tasks.filter((t) => t.phase === phase);
        if (phaseTasks.length === 0) return null;
        return (
          <section key={phase}>
            <h2 className="mb-3 text-lg font-semibold">{phaseLabels[phase]}</h2>
            <TaskList tasks={phaseTasks} showAll />
          </section>
        );
      })}
    </div>
  );
}
