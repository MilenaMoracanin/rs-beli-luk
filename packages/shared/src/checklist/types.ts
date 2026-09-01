export type ChecklistPhaseId =
  | "priprema_zemljista"
  | "sadnja"
  | "navodnjavanje"
  | "zastita"
  | "berba_skladiste";

export type ChecklistFieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "currency"
  | "readonly";

export type AutoFieldKey =
  | "area_ar"
  | "area_m2"
  | "area_ha"
  | "drip_length_m"
  | "npk_kg"
  | "seed_kg";

export type ChecklistFieldDef = {
  key: string;
  label: string;
  type: ChecklistFieldType;
  placeholder?: string;
  options?: readonly string[];
  defaultValue?: string;
  unit?: string;
  autoFrom?: AutoFieldKey;
};

export type CostLine =
  | { type: "field"; key: string }
  | { type: "product"; unitKey: string; qtyKey: string }
  | { type: "product_scaled"; unitKey: string; qtyKey: string; divisor: number };

export type ChecklistCostCalc = {
  lines: CostLine[];
};

export type ChecklistItemTemplate = {
  key: string;
  phase: ChecklistPhaseId;
  title: string;
  description: string;
  /** Dani od datuma sadnje — za planirani termin */
  daysFromPlanting: number;
  timing?: string;
  referenceNote?: string;
  fields: ChecklistFieldDef[];
  costCalc: ChecklistCostCalc;
  /** Ugrađena akcija u UI (evidencija rada) */
  action?: "planting" | "harvest";
};

export type ChecklistItemState = {
  itemKey: string;
  completed: boolean;
  completedAt: string | null;
  fieldValues: Record<string, string>;
  totalCostRsd: number | null;
  plannedDueDate: string | null;
};

export type ChecklistPhaseMeta = {
  id: ChecklistPhaseId;
  title: string;
  description: string;
};
