import Link from "next/link";
import { getDb } from "@/lib/db";
import { fetchJakovoWeatherForecast } from "@/lib/weather";
import { loadSeasonData } from "@/lib/season/load-season-data";
import { SEASON_NAME } from "@/lib/site";
import {
  getDueChecklistItems,
  getNextChecklistItem,
  getUpcomingChecklistItems,
} from "@beli-luk/shared";
import { WeatherWidget } from "@/components/WeatherWidget";
import { ChecklistProgress } from "@/components/dashboard/ChecklistProgress";
import { SeasonChecklistPanel } from "@/components/dashboard/SeasonChecklistPanel";

export default async function DashboardPage() {
  getDb();
  const season = loadSeasonData();

  if (!season) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h1 className="text-xl font-bold text-amber-900">Nema podataka</h1>
        <p className="mt-2 text-amber-800">
          Pokrenite aplikaciju ponovo da se inicijalizuje bazu.
        </p>
      </div>
    );
  }

  const { checklistItems } = season;
  const checklistDone = checklistItems.filter((i) => i.completed).length;
  const dueItems = getDueChecklistItems(checklistItems);
  const upcomingItems = getUpcomingChecklistItems(checklistItems, 14);
  const nextItem = getNextChecklistItem(checklistItems);

  let weather = null;
  try {
    weather = await fetchJakovoWeatherForecast();
  } catch {
    weather = null;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-emerald-900">Pregled</h1>
        <Link
          href="/sezona"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Otvori {SEASON_NAME}
        </Link>
      </header>

      <section>
        {weather ? (
          <WeatherWidget
            days={weather.days}
            irrigationRecommendation={weather.irrigationRecommendation}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            Prognoza trenutno nije dostupna.
          </div>
        )}
      </section>

      <section>
        <ChecklistProgress
          completed={checklistDone}
          total={checklistItems.length}
          dueCount={dueItems.length}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Plan {SEASON_NAME}</h2>
        <SeasonChecklistPanel
          nextItem={nextItem}
          dueItems={dueItems}
          upcomingItems={upcomingItems}
        />
      </section>
    </div>
  );
}
