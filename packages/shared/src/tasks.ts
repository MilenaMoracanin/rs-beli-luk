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
    description:
      "Oranje ~20 cm, fini radni sloj 8–10 cm. NPK 8:16:24 / 6:12:24 / 7:14:21 (400–500 kg/ha) — 1/3 N + sav P i K.",
    daysFromPlanting: -14,
  },
  {
    phase: "planting",
    title: "Priprema sadnog materijala",
    description:
      "100 l vode + Funomil 100 g + Signum 80 g. Potopiti čenove 45 min u džaku, sušiti na provetrenom mestu.",
    daysFromPlanting: -1,
  },
  {
    phase: "planting",
    title: "Sadnja njive",
    description:
      "Sadnja 5.–25.10. Razmak 12–15 cm u redu × 30–50 cm između redova. Dubina 2–3 cm.",
    daysFromPlanting: 0,
  },
  {
    phase: "planting",
    title: "Herbicid pre nicanja",
    description: "Stomp aqua 25–30 ml / 100 m² — posle sadnje, pre nicanja.",
    daysFromPlanting: 3,
  },
  {
    phase: "maintenance",
    title: "Prolećni herbicid",
    description:
      "Mart: Fusilade 1,2 l/ha (ili Select Super 1,2 l/ha). Ne tretirati posle kiše.",
    daysFromPlanting: 150,
  },
  {
    phase: "maintenance",
    title: "Prolećna prihrana azotom",
    description: "Preostali azot + sumpor ((NH4)2SO4 ili fertigacija) kad krene vegetacija.",
    daysFromPlanting: 155,
  },
  {
    phase: "maintenance",
    title: "Kontrola lukove muve",
    description: "Klopka u žutoj činiji. Tretman ako >1 muve (Šiman + Lambda/Cipkord/Polux).",
    daysFromPlanting: 170,
  },
  {
    phase: "maintenance",
    title: "Kontrola lukove rđe",
    description: "Elatus Era 30 ml / 10 l pri pojave. Quadris/Promesa pred berbu ako jak napad.",
    daysFromPlanting: 200,
  },
  {
    phase: "maintenance",
    title: "Tretman protiv truleži",
    description: "3–4 nedelje pre vađenja: Switch 10 g/10 l ili Signum ~30 g/10 l.",
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
    description: "Sušenje na provetrenom mestu.",
    daysFromPlanting: 258,
  },
  {
    phase: "storage",
    title: "Skladištenje",
    description: "Skladištenje suvog belog luka, evidencija ukupnog prinosa.",
    daysFromPlanting: 280,
  },
];
