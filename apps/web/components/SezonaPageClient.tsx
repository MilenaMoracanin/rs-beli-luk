"use client";

import { useSeason } from "@/lib/season/season-store";
import { ChecklistEditor } from "@/components/checklist/ChecklistEditor";
import { ChecklistHashScroll } from "@/components/checklist/ChecklistHashScroll";
import { AreaTable } from "@/components/checklist/AreaTable";
import { StatCard } from "@/components/StatCard";
import { SEASON_NAME } from "@/lib/site";
import { BOSUT_REFERENCE } from "@beli-luk/shared";

export function SezonaPageClient() {
  const { season } = useSeason();
  const sector = season.data.sectors[0];
  const { plan } = season;

  return (
    <div className="space-y-8">
      <ChecklistHashScroll />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Ukupna njiva"
          value={`${plan.fieldLengthM}×${plan.fieldWidthM} m`}
          subtext={`${plan.fieldAreaAr} ari · sadnja ${plan.rowCount} redova duž ${plan.rowLengthM} m`}
          accent="green"
        />
        <StatCard
          label="Očekivani prinos"
          value={`${season.yieldEstimate.avgKg} kg`}
          subtext={`${season.harvestStats.totalHarvested} kg ubrano (${season.harvestStats.percentOfExpected}%)`}
          accent="amber"
        />
        <StatCard
          label="Dana do berbe"
          value={String(season.daysUntilHarvest)}
          subtext={season.data.planting.expectedHarvestDate}
          accent="purple"
        />
      </div>

      {plan.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <h3 className="font-semibold text-amber-900">Upozorenja plana</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-amber-800">
            {plan.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-emerald-800">
        {BOSUT_REFERENCE.title} — plan {SEASON_NAME} sa datumima, troškovima i evidencijom rada.
        Razmak u stavci Sadnja ažurira kalkulaciju redova.
      </p>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Uporedi razmake</h2>
        <AreaTable
          seedKg={season.data.inventory.totalKg}
          selectedInRow={season.checklistInRow}
          selectedRow={season.checklistRowGap}
          fieldLengthM={plan.fieldLengthM}
          fieldWidthM={plan.fieldWidthM}
        />
      </section>

      <ChecklistEditor
        items={season.checklistItems}
        phaseTotals={season.checklistTotals}
        sectorId={sector?.id}
        plantingLogs={season.plantingLogs}
        harvests={season.data.harvests}
        harvestStats={season.harvestStats}
        yieldEstimate={season.yieldEstimate}
      />
    </div>
  );
}
