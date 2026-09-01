import Link from "next/link";
import { SEASON_NAME } from "@/lib/site";
import {
  CHECKLIST_PHASES,
  daysFromToday,
  formatSrDate,
  type ChecklistItemState,
  type ChecklistItemTemplate,
} from "@beli-luk/shared";

type ChecklistItem = ChecklistItemState & { template: ChecklistItemTemplate };

type SeasonChecklistPanelProps = {
  nextItem: ChecklistItem | null;
  dueItems: ChecklistItem[];
  upcomingItems: ChecklistItem[];
};

function phaseTitle(phaseId: string): string {
  return CHECKLIST_PHASES.find((p) => p.id === phaseId)?.title ?? phaseId;
}

function dueLabel(iso: string): string {
  const days = daysFromToday(iso);
  if (days < 0) return `kasni ${Math.abs(days)} d`;
  if (days === 0) return "danas";
  if (days === 1) return "sutra";
  return `za ${days} d`;
}

function ChecklistRow({
  item,
  variant,
}: {
  item: ChecklistItem;
  variant: "overdue" | "upcoming";
}) {
  const date = item.plannedDueDate;
  const styles =
    variant === "overdue"
      ? "border-red-200 bg-red-50"
      : "border-gray-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30";

  return (
    <Link
      href="/sezona"
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${styles}`}
    >
      <div className="min-w-0">
        <p className="font-medium text-gray-900">{item.template.title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{phaseTitle(item.template.phase)}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className={`font-medium ${variant === "overdue" ? "text-red-700" : "text-gray-700"}`}>
          {formatSrDate(date)}
        </p>
        {date && (
          <p className={`text-xs ${variant === "overdue" ? "text-red-600" : "text-emerald-700"}`}>
            {dueLabel(date)}
          </p>
        )}
      </div>
    </Link>
  );
}

export function SeasonChecklistPanel({
  nextItem,
  dueItems,
  upcomingItems,
}: SeasonChecklistPanelProps) {
  return (
    <div className="space-y-6">
      {nextItem && (
        <Link
          href="/sezona"
          className="block rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm transition hover:border-emerald-400"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Sledeće na redu
          </p>
          <h3 className="mt-1 text-lg font-bold text-emerald-950">{nextItem.template.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{phaseTitle(nextItem.template.phase)}</p>
          {nextItem.plannedDueDate && (
            <p className="mt-3 text-sm font-medium text-emerald-800">
              {formatSrDate(nextItem.plannedDueDate)} · {dueLabel(nextItem.plannedDueDate)}
            </p>
          )}
          <p className="mt-3 text-xs text-emerald-700">Otvori {SEASON_NAME} →</p>
        </Link>
      )}

      {dueItems.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-red-800">
            Zakašnjeno ({dueItems.length})
          </h3>
          <ul className="space-y-2">
            {dueItems.map((item) => (
              <li key={item.itemKey}>
                <ChecklistRow item={item} variant="overdue" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">
            Predstojeće (14 dana)
          </h3>
          <Link href="/sezona" className="text-xs text-emerald-700 hover:underline">
            {SEASON_NAME}
          </Link>
        </div>
        {upcomingItems.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            Nema stavki u narednih 14 dana.
          </p>
        ) : (
          <ul className="space-y-2">
            {upcomingItems.map((item) => (
              <li key={item.itemKey}>
                <ChecklistRow item={item} variant="upcoming" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
