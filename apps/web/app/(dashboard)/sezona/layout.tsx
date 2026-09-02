import { getDb } from "@/lib/db";
import { loadSeasonData } from "@/lib/season/load-season-data";
import { SEASON_NAME } from "@/lib/site";
import { SezonaLayoutClient } from "@/components/SezonaLayoutClient";

export default function SezonaLayout({ children }: { children: React.ReactNode }) {
  getDb();
  const season = loadSeasonData();

  if (!season) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-emerald-900">{SEASON_NAME}</h1>
          <p className="mt-1 text-gray-600">Nema podataka za {SEASON_NAME}.</p>
        </header>
        {children}
      </div>
    );
  }

  return <SezonaLayoutClient season={season}>{children}</SezonaLayoutClient>;
}
