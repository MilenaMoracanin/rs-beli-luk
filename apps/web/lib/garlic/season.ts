import { addDays } from "date-fns";
import { SEASON_TASK_TEMPLATES, type TaskPhase } from "@beli-luk/shared";
import type { GarlicVariety } from "@beli-luk/shared";

export type GeneratedTask = {
  phase: TaskPhase;
  title: string;
  description: string;
  dueDate: Date;
  sectorId?: number;
};

export function generateSeasonTasks(
  plantingDate: Date,
  variety: GarlicVariety,
): GeneratedTask[] {
  const tasks: GeneratedTask[] = [];

  for (const template of SEASON_TASK_TEMPLATES) {
    tasks.push({
      phase: template.phase,
      title: template.title,
      description:
        template.title === "Sadnja njive"
          ? `${template.description} (${variety.name})`
          : template.description,
      dueDate: addDays(plantingDate, template.daysFromPlanting),
    });
  }

  return tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function getUpcomingTasks<T extends { dueDate: string; completed: boolean }>(
  tasks: T[],
  daysAhead = 7,
): T[] {
  const now = new Date();
  const limit = addDays(now, daysAhead);

  return tasks
    .filter((task) => {
      if (task.completed) return false;
      const due = new Date(task.dueDate);
      return due <= limit;
    })
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
}

export function getTodaysTasks<T extends { dueDate: string; completed: boolean }>(
  tasks: T[],
): T[] {
  const today = new Date().toISOString().slice(0, 10);
  return tasks.filter(
    (task) => !task.completed && task.dueDate.slice(0, 10) <= today,
  );
}
