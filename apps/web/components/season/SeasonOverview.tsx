import { FieldStatus } from "@/components/field-map/FieldStatus";
import { PlantingProgress } from "@/components/planting-progress/PlantingProgress";
import type { SeasonViewModel } from "@/lib/season/load-season-data";

export function SeasonOverview({ season }: { season: SeasonViewModel }) {
  const sector = season.data.sectors[0];

  return (
    <div className="space-y-4">
      <PlantingProgress {...season.progress} />
      <FieldStatus sector={sector} fieldName={season.data.field.name} plan={season.plan} />
    </div>
  );
}
