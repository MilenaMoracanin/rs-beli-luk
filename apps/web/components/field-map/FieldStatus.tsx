import type { Sector } from "@/lib/db/schema";

const statusConfig = {
  empty: { label: "Nije sadeno", color: "bg-red-100 border-red-300 text-red-800" },
  planting: { label: "Sadnja u toku", color: "bg-amber-100 border-amber-300 text-amber-800" },
  planted: { label: "Sadeno", color: "bg-emerald-100 border-emerald-300 text-emerald-800" },
  harvesting: { label: "Berba u toku", color: "bg-sky-100 border-sky-300 text-sky-800" },
  harvested: { label: "Ubrano", color: "bg-violet-100 border-violet-300 text-violet-800" },
};

type FieldStatusProps = {
  sector: Sector | undefined;
  fieldName: string;
  areaM2: number;
};

export function FieldStatus({ sector, fieldName, areaM2 }: FieldStatusProps) {
  const config = sector ? statusConfig[sector.status] : statusConfig.empty;

  return (
    <div className={`rounded-xl border-2 p-5 ${config.color}`}>
      <h3 className="text-lg font-bold">{fieldName}</h3>
      <p className="mt-1 text-sm opacity-80">{config.label}</p>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="opacity-70">Površina</dt>
          <dd className="font-semibold">{areaM2} m² (10 ari)</dd>
        </div>
        {sector && (
          <>
            <div>
              <dt className="opacity-70">Redovi</dt>
              <dd className="font-semibold">{sector.rowCount}</dd>
            </div>
            <div>
              <dt className="opacity-70">Dužina reda</dt>
              <dd className="font-semibold">{sector.rowLengthM} m</dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
}
