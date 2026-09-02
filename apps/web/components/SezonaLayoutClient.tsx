"use client";

import type { SeasonViewModel } from "@/lib/season/load-season-data";
import { SEASON_NAME } from "@/lib/site";
import { SeasonOverview } from "@/components/season/SeasonOverview";

export function SezonaLayoutClient({
  season,
  children,
}: {
  season: SeasonViewModel;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-emerald-900">{SEASON_NAME}</h1>
        <p className="mt-1 text-gray-600">
          Bosut · {season.data.inventory.totalKg} kg sada · sadnja{" "}
          {season.data.planting.plantingStartDate} · berba{" "}
          {season.data.planting.expectedHarvestDate}
        </p>
      </header>

      <SeasonOverview season={season} />

      <div>{children}</div>
    </div>
  );
}
