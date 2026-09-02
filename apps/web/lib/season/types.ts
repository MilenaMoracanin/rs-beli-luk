export type SectorStatus = "empty" | "planting" | "planted" | "harvesting" | "harvested";
export type PlantingStatus = "planning" | "planting" | "growing" | "harvesting" | "completed";

export type FieldRecord = {
  id: number;
  name: string;
  widthM: number;
  lengthM: number;
  areaM2: number;
  createdAt: string;
};

export type SectorRecord = {
  id: number;
  fieldId: number;
  name: string;
  orderIndex: number;
  widthM: number;
  lengthM: number;
  areaM2: number;
  rowCount: number;
  rowLengthM: number;
  status: SectorStatus;
};

export type SeedInventoryRecord = {
  id: number;
  fieldId: number;
  varietyId: string;
  totalKg: number;
  usedKg: number;
  createdAt: string;
};

export type PlantingRecord = {
  id: number;
  fieldId: number;
  varietyId: string;
  plantingStartDate: string;
  expectedHarvestDate: string;
  status: PlantingStatus;
};

export type VarietyRecord = {
  id: string;
  name: string;
  daysToHarvest: number;
  spacingCm: number;
  rowSpacingCm: number;
  plantingDepthCm: number;
  yieldMinKgPerHa: number;
  yieldMaxKgPerHa: number;
  description: string;
};

export type TaskRecord = {
  id: number;
  plantingId: number;
  sectorId: number | null;
  phase: "planting" | "maintenance" | "harvest" | "storage";
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt: string | null;
};

export type HarvestRecord = {
  id: number;
  sectorId: number;
  plantingId: number;
  kgHarvested: number;
  harvestedAt: string;
};

export type ChecklistRow = {
  itemKey: string;
  completed: boolean;
  completedAt: string | null;
  fieldValues: string;
  estimatedCostRsd: number | null;
  actualCostRsd: number | null;
  updatedAt: string;
};

export type PlantingLogRecord = {
  id: number;
  sectorId: number;
  kgPlanted: number;
  plantedAt: string;
};

export type SeasonState = {
  field: FieldRecord;
  sectors: SectorRecord[];
  inventory: SeedInventoryRecord;
  planting: PlantingRecord;
  variety: VarietyRecord;
  tasks: TaskRecord[];
  harvests: HarvestRecord[];
  checklistRows: ChecklistRow[];
  plantingLogs: PlantingLogRecord[];
};

export type DashboardData = {
  field: FieldRecord;
  sectors: SectorRecord[];
  inventory: SeedInventoryRecord;
  planting: PlantingRecord;
  variety: VarietyRecord | null;
  tasks: TaskRecord[];
  harvests: HarvestRecord[];
  checklistRows: ChecklistRow[];
};
