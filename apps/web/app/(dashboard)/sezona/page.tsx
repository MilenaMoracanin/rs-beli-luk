import { getDb } from "@/lib/db";
import { loadSeasonData } from "@/lib/season/load-season-data";
import { SezonaPageClient } from "@/components/SezonaPageClient";
import { SEASON_NAME } from "@/lib/site";

export default function SezonaPage() {
  getDb();
  const season = loadSeasonData();

  if (!season) {
    return <p>Nema podataka za {SEASON_NAME}.</p>;
  }

  return <SezonaPageClient season={season} />;
}
