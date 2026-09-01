import type { Sector } from "@/lib/db/schema";

const statusConfig = {
  empty: { label: "Nije sadeno", color: "bg-red-100 border-red-300 text-red-800" },
  planting: { label: "U toku", color: "bg-amber-100 border-amber-300 text-amber-800" },
  planted: { label: "Sadeno", color: "bg-emerald-100 border-emerald-300 text-emerald-800" },
  harvesting: { label: "Berba", color: "bg-sky-100 border-sky-300 text-sky-800" },
  harvested: { label: "Ubrano", color: "bg-violet-100 border-violet-300 text-violet-800" },
};

type FieldMapProps = {
  sectors: Sector[];
};

export function FieldMap({ sectors }: FieldMapProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {sectors.map((sector) => {
        const config = statusConfig[sector.status];
        return (
          <div
            key={sector.id}
            className={`rounded-xl border-2 p-4 transition-shadow hover:shadow-md ${config.color}`}
          >
            <h3 className="font-bold">{sector.name}</h3>
            <p className="mt-1 text-sm opacity-80">{config.label}</p>
            <dl className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <dt>Površina</dt>
                <dd>{sector.areaM2} m²</dd>
              </div>
              <div className="flex justify-between">
                <dt>Redovi</dt>
                <dd>{sector.rowCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Dužina reda</dt>
                <dd>{sector.rowLengthM} m</dd>
              </div>
            </dl>
          </div>
        );
      })}
    </div>
  );
}
