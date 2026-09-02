"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDueChecklistItems,
  getNextChecklistItem,
  getUpcomingChecklistItems,
} from "@beli-luk/shared";
import { fetchJakovoWeatherForecast, type WeatherForecast } from "@/lib/weather";
import { useSeason } from "@/lib/season/season-store";
import { SEASON_NAME } from "@/lib/site";
import { WeatherWidget } from "@/components/WeatherWidget";
import { ChecklistProgress } from "@/components/dashboard/ChecklistProgress";
import { SeasonChecklistPanel } from "@/components/dashboard/SeasonChecklistPanel";

export function DashboardPageClient() {
  const { season } = useSeason();
  const [weather, setWeather] = useState<WeatherForecast | null>(null);

  useEffect(() => {
    fetchJakovoWeatherForecast()
      .then(setWeather)
      .catch(() => setWeather(null));
  }, []);

  const { checklistItems } = season;
  const checklistDone = checklistItems.filter((i) => i.completed).length;
  const dueItems = getDueChecklistItems(checklistItems);
  const upcomingItems = getUpcomingChecklistItems(checklistItems, 14);
  const nextItem = getNextChecklistItem(checklistItems);

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
