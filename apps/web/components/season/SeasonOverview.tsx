import { getDueChecklistItems } from "@beli-luk/shared";
import { ChecklistProgress } from "@/components/dashboard/ChecklistProgress";
import type { SeasonViewModel } from "@/lib/season/load-season-data";

export function SeasonOverview({ season }: { season: SeasonViewModel }) {
  const checklistDone = season.checklistItems.filter((i) => i.completed).length;
  const dueCount = getDueChecklistItems(season.checklistItems).length;

  return (
    <ChecklistProgress
      completed={checklistDone}
      total={season.checklistItems.length}
      dueCount={dueCount}
    />
  );
}
