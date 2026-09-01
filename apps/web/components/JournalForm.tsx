"use client";

import { addJournalEntry } from "@/lib/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";

export function JournalForm() {
  return (
    <form action={addJournalEntry} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">Nova beleška</h3>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Naslov
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="npr. Pregled nicanja"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Sadržaj
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={4}
            placeholder="Opisite stanje useva, probleme, primedbe..."
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <FormSubmitButton
        label="Dodaj belešku"
        pendingLabel="Čuvanje..."
        className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
      />
    </form>
  );
}
