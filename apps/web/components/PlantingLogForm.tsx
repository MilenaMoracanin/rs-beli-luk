"use client";

import { useState, useTransition } from "react";
import { useSeason } from "@/lib/season/season-store";
import { FormSubmitButton } from "@/components/FormSubmitButton";

type PlantingLogFormProps = {
  sectorId: number;
};

export function PlantingLogForm({ sectorId }: PlantingLogFormProps) {
  const { logPlanting } = useSeason();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const kgPlanted = Number(new FormData(form).get("kgPlanted"));

    startTransition(() => {
      try {
        logPlanting(sectorId, kgPlanted);
        form.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Greška pri čuvanju.");
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm"
    >
      <h3 className="font-semibold text-emerald-900">Unos dnevnog rada — sadnja</h3>
      <div className="mt-4">
        <label htmlFor="kgPlanted" className="block text-sm font-medium text-gray-700">
          Zasađeno danas (kg)
        </label>
        <input
          id="kgPlanted"
          name="kgPlanted"
          type="number"
          step="0.1"
          min="0.1"
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <FormSubmitButton
        label="Sačuvaj unos"
        pendingLabel="Čuvanje..."
        pending={pending}
        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      />
    </form>
  );
}
