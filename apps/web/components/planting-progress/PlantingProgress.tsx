type PlantingProgressProps = {
  totalKg: number;
  usedKg: number;
  remainingKg: number;
  percentComplete: number;
};

export function PlantingProgress({
  totalKg,
  usedKg,
  remainingKg,
  percentComplete,
}: PlantingProgressProps) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-emerald-900">Napredak sadnje</h3>
        <span className="text-2xl font-bold text-emerald-700">
          {percentComplete}%
        </span>
      </div>
      <div className="mt-4 h-4 overflow-hidden rounded-full bg-emerald-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${Math.min(percentComplete, 100)}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-gray-500">Ukupno</p>
          <p className="font-bold">{totalKg} kg</p>
        </div>
        <div>
          <p className="text-gray-500">Zasađeno</p>
          <p className="font-bold text-emerald-700">{usedKg} kg</p>
        </div>
        <div>
          <p className="text-gray-500">Preostalo</p>
          <p className="font-bold text-amber-700">{remainingKg} kg</p>
        </div>
      </div>
    </div>
  );
}
