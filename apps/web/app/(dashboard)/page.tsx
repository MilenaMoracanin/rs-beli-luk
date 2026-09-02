import { getDb } from "@/lib/db";
import { loadSeasonData } from "@/lib/season/load-season-data";
import { DashboardPageClient } from "@/components/DashboardPageClient";

export default function DashboardPage() {
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

  return <DashboardPageClient season={season} />;
}
