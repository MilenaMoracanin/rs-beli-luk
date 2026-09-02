"use client";

import { useMemo, useState, useTransition } from "react";
import {
  CHECKLIST_PHASES,
  computeItemCost,
  formatRsd,
  formatSrDate,
  hasCostInputs,
  seasonTotal,
  sortItemsByPlannedDate,
  type ChecklistItemTemplate,
} from "@beli-luk/shared";
import { useSeason } from "@/lib/season/season-store";
import { SEASON_NAME } from "@/lib/site";
import type { ChecklistItemState } from "@beli-luk/shared";
import { PlantingLogForm } from "@/components/PlantingLogForm";
import { HarvestForm } from "@/components/HarvestForm";

type MergedItem = ChecklistItemState & { template: ChecklistItemTemplate };

type PlantingLog = { id: number; kgPlanted: number; plantedAt: string };
type HarvestRow = { id: number; kgHarvested: number; harvestedAt: string };

type ChecklistEditorProps = {
  items: MergedItem[];
  phaseTotals: Record<string, number>;
  sectorId?: number;
  plantingLogs?: PlantingLog[];
  harvests?: HarvestRow[];
  harvestStats?: { totalHarvested: number; percentOfExpected: number };
  yieldEstimate?: { avgKg: number; minKg: number; maxKg: number };
};

function ItemCard({
  item,
  sectorId,
  plantingLogs,
  harvests,
  harvestStats,
  yieldEstimate,
}: {
  item: MergedItem;
  sectorId?: number;
  plantingLogs?: PlantingLog[];
  harvests?: HarvestRow[];
  harvestStats?: { totalHarvested: number; percentOfExpected: number };
  yieldEstimate?: { avgKg: number; minKg: number; maxKg: number };
}) {
  const { updateChecklistItem } = useSeason();
  const [pending, startTransition] = useTransition();
  const [values, setValues] = useState(item.fieldValues);
  const [completed, setCompleted] = useState(item.completed);

  const liveTotal = useMemo(() => {
    if (!hasCostInputs(item.template.costCalc, values)) return null;
    return computeItemCost(item.template.costCalc, values);
  }, [item.template.costCalc, values]);

  function save(patch: {
    fieldValues?: Record<string, string>;
    completed?: boolean;
  }) {
    const nextValues = patch.fieldValues ?? values;
    const nextCompleted = patch.completed ?? completed;
    const total = hasCostInputs(item.template.costCalc, nextValues)
      ? computeItemCost(item.template.costCalc, nextValues)
      : null;

    startTransition(() => {
      updateChecklistItem({
        itemKey: item.itemKey,
        completed: nextCompleted,
        fieldValues: nextValues,
        totalCostRsd: total,
      });
    });
  }

  function onFieldChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <article
      id={item.itemKey}
      className={`scroll-mt-24 rounded-xl border p-4 transition-colors target:border-emerald-400 target:ring-2 target:ring-emerald-300 ${
        completed ? "border-emerald-300 bg-emerald-50/50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={completed}
            disabled={pending}
            onChange={(e) => {
              setCompleted(e.target.checked);
              save({ completed: e.target.checked });
            }}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600"
            aria-label={`Završeno: ${item.template.title}`}
          />
          <div>
            <h3 className="font-semibold text-gray-900">{item.template.title}</h3>
            <p className="text-xs font-medium text-violet-700">
              Planirano: {formatSrDate(item.plannedDueDate)}
              {item.template.timing ? ` · ${item.template.timing}` : ""}
            </p>
          </div>
        </div>
        {item.template.costCalc.lines.length > 0 && (
          <div className="rounded-lg bg-emerald-50 px-4 py-2 text-right">
            <p className="text-xs text-emerald-700">Ukupno (iz tvojih cena)</p>
            <p className="text-lg font-bold text-emerald-900">
              {liveTotal != null ? formatRsd(liveTotal) : "—"}
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-600">{item.template.description}</p>
      {item.template.referenceNote && (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {item.template.referenceNote}
        </p>
      )}

      {item.template.fields.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {item.template.fields.map((field) => {
            const value = values[field.key] ?? field.defaultValue ?? "";

            if (field.type === "readonly") {
              return (
                <label key={field.key} className="block text-sm">
                  <span className="text-gray-500">{field.label}</span>
                  <div className="mt-1 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 font-medium text-gray-800">
                    {value}
                    {field.unit ? ` ${field.unit}` : ""}
                  </div>
                </label>
              );
            }

            if (field.type === "select" && field.options) {
              return (
                <label key={field.key} className="block text-sm">
                  <span className="text-gray-500">{field.label}</span>
                  <select
                    value={value}
                    disabled={pending}
                    onChange={(e) => onFieldChange(field.key, e.target.value)}
                    onBlur={() => save({})}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            const inputType =
              field.type === "currency" || field.type === "number" ? "number" : field.type;

            return (
              <label key={field.key} className="block text-sm">
                <span className="text-gray-500">
                  {field.label}
                  {field.unit ? ` (${field.unit})` : field.type === "currency" ? " (RSD)" : ""}
                </span>
                <input
                  type={inputType}
                  value={value}
                  placeholder={field.placeholder}
                  disabled={pending}
                  min={field.type === "currency" || field.type === "number" ? 0 : undefined}
                  step={field.type === "currency" ? 1 : undefined}
                  onChange={(e) => onFieldChange(field.key, e.target.value)}
                  onBlur={() => save({})}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                />
              </label>
            );
          })}
        </div>
      )}

      {item.template.action === "planting" && sectorId != null && (
        <div className="mt-4 space-y-4 border-t border-emerald-100 pt-4">
          <PlantingLogForm sectorId={sectorId} />
          {plantingLogs && plantingLogs.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Datum</th>
                    <th className="px-4 py-3 text-left">Kg</th>
                  </tr>
                </thead>
                <tbody>
                  {plantingLogs.map((log) => (
                    <tr key={log.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">{log.plantedAt}</td>
                      <td className="px-4 py-3">{log.kgPlanted} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {item.template.action === "harvest" && sectorId != null && (
        <div className="mt-4 space-y-4 border-t border-violet-100 pt-4">
          {yieldEstimate && harvestStats && (
            <p className="text-sm text-gray-600">
              Očekivano {yieldEstimate.minKg}–{yieldEstimate.maxKg} kg (prosek {yieldEstimate.avgKg}{" "}
              kg) · ubrano {harvestStats.totalHarvested} kg ({harvestStats.percentOfExpected}%)
            </p>
          )}
          <HarvestForm sectorId={sectorId} />
          {harvests && harvests.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Datum</th>
                    <th className="px-4 py-3 text-left">Ubrano (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...harvests]
                    .sort(
                      (a, b) =>
                        new Date(b.harvestedAt).getTime() - new Date(a.harvestedAt).getTime(),
                    )
                    .map((harvest) => (
                      <tr key={harvest.id} className="border-t border-gray-100">
                        <td className="px-4 py-3">{harvest.harvestedAt}</td>
                        <td className="px-4 py-3 font-medium">{harvest.kgHarvested} kg</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function ChecklistEditor({
  items,
  phaseTotals: phaseTotalsMap,
  sectorId,
  plantingLogs,
  harvests,
  harvestStats,
  yieldEstimate,
}: ChecklistEditorProps) {
  const totalSeason = useMemo(() => seasonTotal(items), [items]);
  const completedCount = items.filter((i) => i.completed).length;
  const filledCosts = items.filter((i) => i.totalCostRsd != null && i.totalCostRsd > 0).length;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        Unesi svoje cene u polja ispod — ukupno se računa automatski. Datumi se planiraju od dana
        sadnje; možeš ih prilagoditi po stavci.
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">Ukupni troškovi {SEASON_NAME}</p>
          <p className="text-2xl font-bold text-emerald-900">
            {totalSeason > 0 ? formatRsd(totalSeason) : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Stavki sa unetom cenom</p>
          <p className="text-2xl font-bold text-gray-900">
            {filledCosts}/{items.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Završeno</p>
          <p className="text-2xl font-bold text-gray-900">
            {completedCount}/{items.length}
          </p>
        </div>
      </div>

      {CHECKLIST_PHASES.map((phase) => {
        const phaseItems = sortItemsByPlannedDate(
          items.filter((i) => i.template.phase === phase.id),
        );
        if (phaseItems.length === 0) return null;
        const phaseTotal = phaseTotalsMap[phase.id] ?? 0;

        return (
          <section key={phase.id}>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-emerald-900">{phase.title}</h2>
                <p className="text-sm text-gray-600">{phase.description}</p>
              </div>
              <div className="rounded-lg bg-gray-100 px-4 py-2 text-sm">
                <span className="text-gray-500">Ukupno faza: </span>
                <span className="font-semibold text-gray-900">
                  {phaseTotal > 0 ? formatRsd(phaseTotal) : "—"}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {phaseItems.map((item) => (
                <ItemCard
                  key={item.itemKey}
                  item={item}
                  sectorId={sectorId}
                  plantingLogs={plantingLogs}
                  harvests={harvests}
                  harvestStats={harvestStats}
                  yieldEstimate={yieldEstimate}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
