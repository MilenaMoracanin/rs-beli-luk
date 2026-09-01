"use client";

import { logPlanting } from "@/lib/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";

type PlantingLogFormProps = {
  sectorId: number;
};

export function PlantingLogForm({ sectorId }: PlantingLogFormProps) {
  return (
    <form action={logPlanting} className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-emerald-900">Unos dnevnog rada — sadnja</h3>
      <input type="hidden" name="sectorId" value={sectorId} />
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
      <FormSubmitButton
        label="Sačuvaj unos"
        pendingLabel="Čuvanje..."
        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      />
    </form>
  );
}
