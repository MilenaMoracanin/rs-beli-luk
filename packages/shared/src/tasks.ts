export type TaskPhase = "planting" | "maintenance" | "harvest" | "storage";

export type TaskTemplate = {
  phase: TaskPhase;
  title: string;
  description: string;
  daysFromPlanting: number;
};

export const SEASON_TASK_TEMPLATES: TaskTemplate[] = [
  {
    phase: "planting",
    title: "Priprema zemljišta",
    description: "Oranje, freziranje, provera pH (6–7), đubrenje pre sadnje.",
    daysFromPlanting: -7,
  },
  {
    phase: "planting",
    title: "Sadnja njive",
    description: "Sadnja čenova na dubini 3–5 cm, razmak 10×28 cm.",
    daysFromPlanting: 0,
  },
  {
    phase: "planting",
    title: "Mulčiranje",
    description: "Mulčiranje gredica za zaštitu i zadržavanje vlage.",
    daysFromPlanting: 7,
  },
  {
    phase: "maintenance",
    title: "Provera nicanja",
    description: "Provera prorastanja i popunjavanje praznina u redovima.",
    daysFromPlanting: 150,
  },
  {
    phase: "maintenance",
    title: "Prvo plijevljenje",
    description: "Plijevljenje cele njive (10 ari).",
    daysFromPlanting: 160,
  },
  {
    phase: "maintenance",
    title: "Navodnjavanje — provera vlage",
    description: "Zalivanje u sušnom periodu, prioritet po zonama.",
    daysFromPlanting: 180,
  },
  {
    phase: "maintenance",
    title: "Kontrola bolesti",
    description: "Pregled na belu plamenjaču i druge bolesti.",
    daysFromPlanting: 210,
  },
  {
    phase: "maintenance",
    title: "Poslednje plijevljenje",
    description: "Finalno plijevljenje pre berbe.",
    daysFromPlanting: 230,
  },
  {
    phase: "harvest",
    title: "Procena spremnosti za berbu",
    description: "Provera požutelih donjih listova (~50%).",
    daysFromPlanting: 240,
  },
  {
    phase: "harvest",
    title: "Berba njive",
    description: "Berba kada je usev spreman, unos ukupnog prinosa.",
    daysFromPlanting: 255,
  },
  {
    phase: "storage",
    title: "Sušenje",
    description: "Sušenje 2–4 nedelje na suvom, provetrenom mestu.",
    daysFromPlanting: 258,
  },
  {
    phase: "storage",
    title: "Skladištenje",
    description: "Skladištenje suvog belog luka, evidencija ukupnog prinosa.",
    daysFromPlanting: 280,
  },
];
