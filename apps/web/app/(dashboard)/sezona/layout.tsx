import { getDb } from "@/lib/db";
import { loadSeasonData } from "@/lib/season/load-season-data";
import { SEASON_NAME } from "@/lib/site";
import { SeasonOverview } from "@/components/season/SeasonOverview";

export default function SezonaLayout({ children }: { children: React.ReactNode }) {
  getDb();
  const season = loadSeasonData();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-emerald-900">{SEASON_NAME}</h1>
        {season ? (
          <p className="mt-1 text-gray-600">
            Bosut · {season.data.inventory.totalKg} kg sada · sadnja{" "}
            {season.data.planting.plantingStartDate} · berba{" "}
            {season.data.planting.expectedHarvestDate}
          </p>
        ) : (
          <p className="mt-1 text-gray-600">
            Plan i vođenje {SEASON_NAME} — zadaci, datumi i troškovi
          </p>
        )}
      </header>

      {season && <SeasonOverview season={season} />}

      <div>{children}</div>
    </div>
  );
}
