import Link from "next/link";
import {
  BOSUT_CLAIM_COUNT,
  BOSUT_KNOWN_CONFLICTS,
  BOSUT_OPTIMAL_CONDITIONS,
  BOSUT_REFERENCE,
  BOSUT_SOURCES,
  BOSUT_SOURCE_COUNT,
  YIELD_BENCHMARKS,
  buildMetricComparisons,
  getConflictingMetrics,
} from "@beli-luk/shared";
import { StatCard } from "@/components/StatCard";

export default function BosutResearchPage() {
  const comparisons = buildMetricComparisons();
  const conflicts = getConflictingMetrics();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-emerald-900">Sorta Bosut — istraživanje</h1>
        <p className="mt-1 text-gray-600">
          Prikupljeni podaci za poređenje — referentni vodič ima prioritet kod konflikata
        </p>
      </header>

      <section className="rounded-xl border-2 border-emerald-300 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Primarni izvor
            </p>
            <h2 className="mt-1 text-lg font-semibold text-emerald-900">{BOSUT_REFERENCE.title}</h2>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
            referentni vodič
          </span>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div>
            <dt className="text-gray-500">Sadnja</dt>
            <dd className="font-medium">
              {BOSUT_REFERENCE.planting.windowStart} – {BOSUT_REFERENCE.planting.windowEnd}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Rastojanje</dt>
            <dd className="font-medium">
              {BOSUT_REFERENCE.planting.spacingInRowCmMin}–
              {BOSUT_REFERENCE.planting.spacingInRowCmMax} ×{" "}
              {BOSUT_REFERENCE.planting.spacingBetweenRowsCmMin}–
              {BOSUT_REFERENCE.planting.spacingBetweenRowsCmMax} cm
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Priprema sada</dt>
            <dd className="font-medium">{BOSUT_REFERENCE.seedPrep.solution}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Izvora"
          value={String(BOSUT_SOURCE_COUNT)}
          subtext="Instituti, nauka, mediji, praksa"
          accent="green"
        />
        <StatCard
          label="Podataka"
          value={String(BOSUT_CLAIM_COUNT)}
          subtext="Strukturiranih tvrdnji"
          accent="blue"
        />
        <StatCard
          label="Konflikata"
          value={String(conflicts.length)}
          subtext="Različite vrednosti po izvoru"
          accent="amber"
        />
      </div>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <h2 className="text-lg font-semibold text-emerald-900">Optimalni uslovi (sinteza)</h2>
        <p className="mt-1 text-sm text-emerald-800">
          Preporuke na osnovu poređenja izvora — prioritet referentnom vodiču.
        </p>
        <dl className="mt-4 space-y-4">
          {BOSUT_OPTIMAL_CONDITIONS.map((item) => (
            <div key={item.attribute} className="rounded-lg bg-white/80 p-4">
              <dt className="font-medium text-gray-900">{item.attribute.replace(/_/g, " ")}</dt>
              <dd className="mt-1 text-sm font-semibold text-emerald-800">{item.recommended}</dd>
              <dd className="mt-2 text-sm text-gray-600">{item.rationale}</dd>
              <dd className="mt-1 text-xs text-gray-400">
                Pouzdanost: {item.confidence} · Izvori: {item.sourceIds.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Prinos — poređenje izvora</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Izvor</th>
                <th className="px-4 py-3 text-left">Prinos (kg/ha)</th>
                <th className="px-4 py-3 text-left">Za 100 kg sada</th>
              </tr>
            </thead>
            <tbody>
              {YIELD_BENCHMARKS.map((row) => (
                <tr key={row.label} className="border-t border-gray-100">
                  <td className="px-4 py-3">{row.label}</td>
                  <td className="px-4 py-3 font-medium">
                    {row.kgPerHa.toLocaleString("sr-RS")} kg/ha
                    {"range" in row && row.range && (
                      <span className="ml-1 text-gray-500">
                        ({row.range.min}–{row.range.max})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    ~{Math.round(row.kgPerHa / 100).toLocaleString("sr-RS")} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Poznati konflikti u podacima</h2>
        <div className="space-y-3">
          {BOSUT_KNOWN_CONFLICTS.map((c) => (
            <div key={c.attribute} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-medium text-amber-900">{c.attribute.replace(/_/g, " ")}</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-amber-800">
                {c.values.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-amber-900">
                <span className="font-medium">Rešenje:</span> {c.resolution}
              </p>
              {"winner" in c && c.winner && (
                <p className="mt-1 text-xs font-medium text-emerald-700">
                  Primena: {c.winner.replace(/-/g, " ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Svi podaci po kategorijama</h2>
        <div className="space-y-4">
          {comparisons.map((metric) => (
            <details
              key={`${metric.category}-${metric.attribute}`}
              className="rounded-xl border border-gray-200 bg-white"
            >
              <summary className="cursor-pointer px-4 py-3 font-medium">
                <span className="text-gray-500">{metric.category} · </span>
                {metric.attribute.replace(/_/g, " ")}
                {metric.hasConflict && (
                  <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                    konflikt
                  </span>
                )}
              </summary>
              <div className="border-t border-gray-100 px-4 py-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2">Izvor</th>
                      <th className="pb-2">Vrednost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metric.entries.map((entry) => (
                      <tr key={entry.sourceId} className="border-t border-gray-50">
                        <td className="py-2 pr-4 align-top">{entry.sourceTitle}</td>
                        <td className="py-2">
                          <span className="font-medium">{entry.value}</span>
                          <p className="mt-1 text-xs text-gray-500">{entry.rawText}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Izvori ({BOSUT_SOURCE_COUNT})</h2>
        <ul className="space-y-2 text-sm">
          {BOSUT_SOURCES.map((source) => (
            <li key={source.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3">
              {source.url.startsWith("local://") ? (
                <span
                  className={`font-medium ${source.id === "referentni-vodic" ? "text-emerald-800" : "text-gray-900"}`}
                >
                  {source.title}
                  {source.id === "referentni-vodic" && (
                    <span className="ml-2 rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                      primarni
                    </span>
                  )}
                </span>
              ) : (
                <Link
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-700 hover:underline"
                >
                  {source.title}
                </Link>
              )}
              <p className="text-xs text-gray-500">
                {source.type} · {source.language}
                {source.author && ` · ${source.author}`}
                {source.publishedAt && ` · ${source.publishedAt}`}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
