"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatISO } from "date-fns";
import { createDefaultSeasonState } from "@/lib/season/defaults";
import { buildSeasonViewModel, type SeasonViewModel } from "@/lib/season/load-season-data";
import type { SeasonState } from "@/lib/season/types";

const STORAGE_KEY = "beli-luk-season-2026";

type SeasonContextValue = {
  season: SeasonViewModel;
  logPlanting: (sectorId: number, kgPlanted: number) => void;
  logHarvest: (sectorId: number, kgHarvested: number) => void;
  updateChecklistItem: (input: {
    itemKey: string;
    completed: boolean;
    fieldValues: Record<string, string>;
    totalCostRsd: number | null;
  }) => void;
};

const SeasonContext = createContext<SeasonContextValue | null>(null);

function loadState(): SeasonState {
  if (typeof window === "undefined") {
    return createDefaultSeasonState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultSeasonState();
    return JSON.parse(raw) as SeasonState;
  } catch {
    return createDefaultSeasonState();
  }
}

function saveState(state: SeasonState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SeasonState>(createDefaultSeasonState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [state, ready]);

  const logPlanting = useCallback((sectorId: number, kgPlanted: number) => {
    if (!sectorId || !kgPlanted || kgPlanted <= 0) {
      throw new Error("Unesite validnu količinu.");
    }

    setState((prev) => {
      const remaining = prev.inventory.totalKg - prev.inventory.usedKg;
      if (kgPlanted > remaining + 0.01) {
        throw new Error(`Preostalo je samo ${remaining.toFixed(1)} kg sadnog materijala.`);
      }

      const now = formatISO(new Date(), { representation: "date" });
      const nextLogId =
        prev.plantingLogs.reduce((max, log) => Math.max(max, log.id), 0) + 1;

      const plantingLogs = [
        ...prev.plantingLogs,
        { id: nextLogId, sectorId, kgPlanted, plantedAt: now },
      ];

      const sectorLogs = plantingLogs.filter((log) => log.sectorId === sectorId);
      const sectorTotal = sectorLogs.reduce((sum, log) => sum + log.kgPlanted, 0);
      const estimatedKg = prev.inventory.totalKg;
      let status: "empty" | "planting" | "planted" = "planting";
      if (sectorTotal >= estimatedKg * 0.95) status = "planted";
      else if (sectorTotal <= 0) status = "empty";

      const sectors = prev.sectors.map((sector) =>
        sector.id === sectorId ? { ...sector, status } : sector,
      );

      const planting =
        prev.planting.status === "planning"
          ? { ...prev.planting, status: "planting" as const }
          : prev.planting;

      return {
        ...prev,
        inventory: { ...prev.inventory, usedKg: prev.inventory.usedKg + kgPlanted },
        plantingLogs,
        sectors,
        planting,
      };
    });
  }, []);

  const logHarvest = useCallback((sectorId: number, kgHarvested: number) => {
    if (!sectorId || !kgHarvested || kgHarvested <= 0) {
      throw new Error("Unesite validan prinos.");
    }

    setState((prev) => {
      const now = formatISO(new Date(), { representation: "date" });
      const nextId = prev.harvests.reduce((max, row) => Math.max(max, row.id), 0) + 1;

      const harvests = [
        ...prev.harvests,
        {
          id: nextId,
          sectorId,
          plantingId: prev.planting.id,
          kgHarvested,
          harvestedAt: now,
        },
      ];

      const sectors = prev.sectors.map((sector) =>
        sector.id === sectorId ? { ...sector, status: "harvested" as const } : sector,
      );

      const allHarvested = sectors.every((s) => s.status === "harvested");
      const planting = {
        ...prev.planting,
        status: allHarvested ? ("completed" as const) : ("harvesting" as const),
      };

      return { ...prev, harvests, sectors, planting };
    });
  }, []);

  const updateChecklistItem = useCallback(
    (input: {
      itemKey: string;
      completed: boolean;
      fieldValues: Record<string, string>;
      totalCostRsd: number | null;
    }) => {
      setState((prev) => {
        const now = formatISO(new Date(), { representation: "date" });
        const existing = prev.checklistRows.find((row) => row.itemKey === input.itemKey);
        const values = {
          completed: input.completed,
          completedAt: input.completed ? now : null,
          fieldValues: JSON.stringify(input.fieldValues),
          estimatedCostRsd: input.totalCostRsd,
          actualCostRsd: input.totalCostRsd,
          updatedAt: now,
        };

        const checklistRows = existing
          ? prev.checklistRows.map((row) =>
              row.itemKey === input.itemKey ? { ...row, ...values } : row,
            )
          : [
              ...prev.checklistRows,
              { itemKey: input.itemKey, ...values },
            ];

        return { ...prev, checklistRows };
      });
    },
    [],
  );

  const season = useMemo(() => buildSeasonViewModel(state), [state]);

  const value = useMemo(
    () => ({ season, logPlanting, logHarvest, updateChecklistItem }),
    [season, logPlanting, logHarvest, updateChecklistItem],
  );

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Učitavanje…
      </div>
    );
  }

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
}

export function useSeason() {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error("useSeason mora biti unutar SeasonProvider.");
  return ctx;
}
