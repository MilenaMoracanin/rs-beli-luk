import type { OptimalRecommendation } from "./types";
import { BOSUT_REFERENCE, BOSUT_REFERENCE_ID } from "./reference-document";

/**
 * Sinteza optimalnih uslova — referentni vodič ima prioritet nad web izvorima.
 */
export const BOSUT_OPTIMAL_CONDITIONS: OptimalRecommendation[] = [
  {
    attribute: "sorta_i_sadni_materijal",
    category: "registration",
    recommended: "Bosut — sertifikovani sadni materijal, krupni čenovi ~8 g",
    rationale:
      "Referentni vodič + IFVCNS. Priprema: potapanje u Funomil + Signum pre sadnje.",
    sourceIds: [BOSUT_REFERENCE_ID, "ns-seme-savet"],
    confidence: "high",
  },
  {
    attribute: "rok_sadnje",
    category: "planting",
    recommended: `${BOSUT_REFERENCE.planting.windowStart} – ${BOSUT_REFERENCE.planting.windowEnd}`,
    range: { min: 5, max: 25, unit: "oktobar" },
    rationale: "Referentni vodič — fiksni prozor sadnje.",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "dubina_sadnje",
    category: "planting",
    recommended: `${BOSUT_REFERENCE.planting.depthCmMin}–${BOSUT_REFERENCE.planting.depthCmMax} cm pokrivni sloj iznad vrha čena`,
    range: {
      min: BOSUT_REFERENCE.planting.depthCmMin,
      max: BOSUT_REFERENCE.planting.depthCmMax,
      unit: "cm",
    },
    rationale:
      "Predsetvena priprema: fini sloj zemlje 8–10 cm omogućava pokrovni sloj 2–3 cm pri sadnji.",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "rastojanje",
    category: "spacing",
    recommended: `${BOSUT_REFERENCE.planting.spacingInRowCmMin}–${BOSUT_REFERENCE.planting.spacingInRowCmMax} cm u redu × ${BOSUT_REFERENCE.planting.spacingBetweenRowsCmMin}–${BOSUT_REFERENCE.planting.spacingBetweenRowsCmMax} cm između redova`,
    range: {
      min: BOSUT_REFERENCE.planting.spacingInRowCmMin,
      max: BOSUT_REFERENCE.planting.spacingInRowCmMax,
      unit: "cm u redu",
    },
    rationale:
      "Referentni vodič zamenjuje starije preporuke (10 cm u redu, šestoredni sistem 20 cm).",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "priprema_sadnog_materijala",
    category: "protection",
    recommended: BOSUT_REFERENCE.seedPrep.solution,
    rationale: `${BOSUT_REFERENCE.seedPrep.soakMinutes} min potapanje u mrežastom džaku, sušenje na provetrenom mestu.`,
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "prihrana",
    category: "fertilization",
    recommended: `NPK ${BOSUT_REFERENCE.fertilization.baseNpkFormulas.join(" / ")} — ${BOSUT_REFERENCE.fertilization.baseNpkKgPerHaMin}–${BOSUT_REFERENCE.fertilization.baseNpkKgPerHaMax} kg/ha pri osnovnoj obradi`,
    rationale:
      "1/3 azota + sav P i K jesen; ostatak azota u proleće. Sumpor obavezan (K2SO4 ili (NH4)2SO4). Uvek na osnovu analize zemljišta.",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "priprema_zemljista",
    category: "general",
    recommended: `Oranje ~${BOSUT_REFERENCE.soilPrep.plowingDepthCm} cm; radni sloj ${BOSUT_REFERENCE.soilPrep.seedbedDepthCmMin}–${BOSUT_REFERENCE.soilPrep.seedbedDepthCmMax} cm`,
    rationale: "Beli luk ima plitak koren — fina, rastresita gornja horizonata.",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "herbicidi",
    category: "protection",
    recommended: `Posle sadnje: ${BOSUT_REFERENCE.herbicides.preEmergence.product} ${BOSUT_REFERENCE.herbicides.preEmergence.dose}. Proleće (mart): ${BOSUT_REFERENCE.herbicides.spring.product} ${BOSUT_REFERENCE.herbicides.spring.dose}`,
    rationale:
      "Alternativa za uskolisne korove: Select Super 1,2 l/ha. Ne tretirati posle kiše.",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "lukova_muva",
    category: "protection",
    recommended: "Klopka u žutoj činiji; tretman ako >1 muve (Šiman + Lambda/Cipkord/Polux)",
    rationale: "Prva generacija najštetnija. Minirajuća muva — isti preparati.",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "lukova_rđa",
    category: "disease",
    recommended: "Elatus Era 30 ml / 10 l; pred berbu Quadris/Promesa ako jak napad",
    rationale: "Pojava u proleće pri kišama i temperaturnim oscilacijama.",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "trulež",
    category: "disease",
    recommended: "3–4 nedelje pre vađenja: Switch 10 g/10 l ili Signum ~30 g/10 l",
    rationale: "Preventivni fungicidni tretman pred berbu.",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "kolicina_sadnog_materijala",
    category: "planting",
    recommended: "100 kg za ovu sezonu (planiranje od količine sada, ne od površine)",
    rationale:
      "Web izvori navode 1400–1800 kg/ha za manje čenove; sa ~8 g čenovima 100 kg ≈ 12.500 biljaka.",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "morfologija_cilj",
    category: "morphology",
    recommended: "Glavice 35–60 g, 9–10 čenova, krupni čenovi ~8 g za sadnju",
    rationale: "Operativni parametri proizvođača uz referentni vodič.",
    sourceIds: [BOSUT_REFERENCE_ID],
    confidence: "high",
  },
  {
    attribute: "ocekivani_prinos",
    category: "yield",
    recommended: "7–10× od mase sadnog materijala (700–1000 kg iz 100 kg sada)",
    range: { min: 700, max: 1000, unit: "kg iz 100 kg sada" },
    rationale: "AgroSmart/ogledi; referentni vodič ne navodi prinos — ostaje iz stručne literature.",
    sourceIds: [BOSUT_REFERENCE_ID, "agrosmart-2016"],
    confidence: "medium",
  },
];

export const BOSUT_KNOWN_CONFLICTS = [
  {
    attribute: "rastojanje_u_redu",
    values: ["12–15 cm (referentni vodič)", "7–10 cm (PSSS)", "10 cm (Agro Info Net)"],
    resolution: "Primeniti referentni vodič: 12–15 cm u redu.",
    winner: BOSUT_REFERENCE_ID,
  },
  {
    attribute: "rastojanje_izmedju_redova",
    values: ["30–50 cm (referentni vodič)", "40–50 cm (PSSS)", "20 cm šestoredno (Agro Info Net)"],
    resolution: "Referentni vodič: 30–50 cm. Planiranje koristi 40 cm.",
    winner: BOSUT_REFERENCE_ID,
  },
  {
    attribute: "priprema_sadnog_materijala",
    values: [
      "Funomil + Signum, 45 min (referentni vodič)",
      "Cineb/Ditan 10–20 min (PSSS)",
    ],
    resolution: "Referentni vodič — Funomil 100 g + Signum 80 g / 100 l vode.",
    winner: BOSUT_REFERENCE_ID,
  },
  {
    attribute: "herbicid_pre_nicanja",
    values: [
      "Stomp aqua 25–30 ml / 100 m² (referentni vodič)",
      "Stomp 330 EC 4–5 l/ha (PSSS)",
    ],
    resolution: "Referentni vodič — Stomp aqua u dozi po m².",
    winner: BOSUT_REFERENCE_ID,
  },
  {
    attribute: "prihrana_npk",
    values: [
      "8:16:24 / 6:12:24 / 7:14:21 (referentni vodič)",
      "NPK 8-16-24 + NPK 15-15-15 februar (PSSS)",
    ],
    resolution:
      "Referentni vodič naglašava kalijum i sumpor; prolećni azot kad krene vegetacija, ne fiksno 15-15-15.",
    winner: BOSUT_REFERENCE_ID,
  },
  {
    attribute: "masa_lukovice",
    values: ["35–60 g (operativa)", "60 g (NS Seme)", "80 g (IFVCNS 2000)"],
    resolution: "Operativni opseg 35–60 g; stariji opisi navode veće semenske glavice.",
    winner: BOSUT_REFERENCE_ID,
  },
  {
    attribute: "broj_cenova",
    values: ["9–10 (operativa / Kurir)", "12–14 (IFVCNS 2000)"],
    resolution: "9–10 čenova po glavici u proizvodnji.",
    winner: BOSUT_REFERENCE_ID,
  },
] as const;

export { BOSUT_REFERENCE, BOSUT_REFERENCE_ID };
