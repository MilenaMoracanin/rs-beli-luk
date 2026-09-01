import { SEASON_NAME } from "@/lib/site";

type ChecklistProgressProps = {
  completed: number;
  total: number;
  dueCount: number;
};

export function ChecklistProgress({ completed, total, dueCount }: ChecklistProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-violet-900">Checklist {SEASON_NAME}</h3>
        <span className="text-2xl font-bold text-violet-700">{percent}%</span>
      </div>
      <div className="mt-4 h-4 overflow-hidden rounded-full bg-violet-100">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-500"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-gray-500">Ukupno</p>
          <p className="font-bold">{total}</p>
        </div>
        <div>
          <p className="text-gray-500">Završeno</p>
          <p className="font-bold text-violet-700">{completed}</p>
        </div>
        <div>
          <p className="text-gray-500">Kasni</p>
          <p className={`font-bold ${dueCount > 0 ? "text-red-600" : "text-gray-700"}`}>
            {dueCount}
          </p>
        </div>
      </div>
    </div>
  );
}
