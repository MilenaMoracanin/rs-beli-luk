"use client";

import { logHarvest } from "@/lib/actions";
import { FormSubmitButton } from "@/components/FormSubmitButton";

type HarvestFormProps = {
  sectorId: number;
};

export function HarvestForm({ sectorId }: HarvestFormProps) {
  return (
    <form action={logHarvest} className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-violet-900">Unos prinosa — berba</h3>
      <input type="hidden" name="sectorId" value={sectorId} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="kgHarvested" className="block text-sm font-medium text-gray-700">
            Ubrano (kg)
          </label>
          <input
            id="kgHarvested"
            name="kgHarvested"
            type="number"
            step="0.1"
            min="0.1"
            required
            placeholder="npr. 400"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Beleška (opciono)
          </label>
          <input
            id="notes"
            name="notes"
            type="text"
            placeholder="npr. Dobar prinos, krupni glavici"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <FormSubmitButton
        label="Sačuvaj prinos"
        pendingLabel="Čuvanje..."
        className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
      />
    </form>
  );
}
