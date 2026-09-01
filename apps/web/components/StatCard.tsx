type StatCardProps = {
  label: string;
  value: string;
  subtext?: string;
  accent?: "green" | "amber" | "blue" | "purple";
};

const accentClasses = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  blue: "border-sky-200 bg-sky-50 text-sky-900",
  purple: "border-violet-200 bg-violet-50 text-violet-900",
};

export function StatCard({
  label,
  value,
  subtext,
  accent = "green",
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${accentClasses[accent]}`}
    >
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subtext && <p className="mt-1 text-xs opacity-70">{subtext}</p>}
    </div>
  );
}
