import { getDb } from "@/lib/db";
import { getDashboardData } from "@/lib/db/seed";
import { JournalForm } from "@/components/JournalForm";

export default function DnevnikPage() {
  getDb();
  const data = getDashboardData(getDb());

  if (!data) {
    return <p>Nema podataka.</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-emerald-900">Dnevnik rasta</h1>
        <p className="text-gray-600">
          Beleške i posmatranja tokom sezone
        </p>
      </header>

      <JournalForm />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Prethodne beleške</h2>
        {data.journalEntries.length === 0 ? (
          <p className="text-sm text-gray-500">Još nema beleški.</p>
        ) : (
          <div className="space-y-3">
            {data.journalEntries
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                    <time className="shrink-0 text-xs text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString("sr-RS")}
                    </time>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </article>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
