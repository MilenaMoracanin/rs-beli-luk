"use client";

import { toggleTask } from "@/lib/actions";
import type { Task } from "@/lib/db/schema";

type TaskListProps = {
  tasks: Task[];
  showAll?: boolean;
};

export function TaskList({ tasks, showAll = false }: TaskListProps) {
  const displayTasks = showAll
    ? tasks
    : tasks.filter((t) => !t.completed).slice(0, 8);

  if (displayTasks.length === 0) {
    return (
      <p className="text-sm text-gray-500">Nema zadataka za prikaz.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {displayTasks.map((task) => (
        <li
          key={task.id}
          className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3"
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => toggleTask(task.id, e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600"
          />
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}
            >
              {task.title}
            </p>
            <p className="text-xs text-gray-500">{task.dueDate}</p>
            {showAll && (
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-600">
            {task.phase}
          </span>
        </li>
      ))}
    </ul>
  );
}
