import type { ChecklistItemTemplate } from "./types";

function addDaysToIso(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatSrDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}.`;
}

export function daysFromToday(iso: string): number {
  const today = new Date(`${todayIso()}T12:00:00`);
  const target = new Date(`${iso}T12:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function plannedDateFromPlanting(
  plantingStartDate: string,
  daysFromPlanting: number,
): string {
  return addDaysToIso(plantingStartDate, daysFromPlanting);
}

export function sortItemsByPlannedDate<
  T extends { plannedDueDate: string | null; template: ChecklistItemTemplate },
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const da = a.plannedDueDate ?? "9999-12-31";
    const db = b.plannedDueDate ?? "9999-12-31";
    if (da !== db) return da.localeCompare(db);
    return a.template.daysFromPlanting - b.template.daysFromPlanting;
  });
}

export function getUpcomingChecklistItems<
  T extends { plannedDueDate: string | null; completed: boolean },
>(items: T[], daysAhead = 14): T[] {
  const today = todayIso();
  const limit = addDaysToIso(today, daysAhead);

  return items
    .filter((item) => {
      if (item.completed || !item.plannedDueDate) return false;
      return item.plannedDueDate >= today && item.plannedDueDate <= limit;
    })
    .sort((a, b) => (a.plannedDueDate ?? "").localeCompare(b.plannedDueDate ?? ""));
}

export function getDueChecklistItems<
  T extends { plannedDueDate: string | null; completed: boolean },
>(items: T[]): T[] {
  const today = todayIso();
  return items
    .filter(
      (item) => !item.completed && item.plannedDueDate != null && item.plannedDueDate <= today,
    )
    .sort((a, b) => (a.plannedDueDate ?? "").localeCompare(b.plannedDueDate ?? ""));
}

export function getNextChecklistItem<
  T extends { plannedDueDate: string | null; completed: boolean },
>(items: T[]): T | null {
  const pending = items
    .filter((item) => !item.completed && item.plannedDueDate)
    .sort((a, b) => (a.plannedDueDate ?? "").localeCompare(b.plannedDueDate ?? ""));

  return pending[0] ?? null;
}
