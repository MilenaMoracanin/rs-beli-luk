/**
 * Referentni vodič za uzgoj Bosuta — primarni izvor kad postoji konflikt sa web scrapom.
 */
export const BOSUT_REFERENCE_ID = "referentni-vodic";

export const BOSUT_REFERENCE = {
  id: BOSUT_REFERENCE_ID,
  title: "Referentni vodič — agrotehnika belog luka Bosut",
  type: "reference" as const,
  language: "sr" as const,

  planting: {
    windowStart: "05.10.",
    windowEnd: "25.10.",
    depthCmMin: 2,
    depthCmMax: 3,
    spacingInRowCmMin: 12,
    spacingInRowCmMax: 15,
    spacingBetweenRowsCmMin: 30,
    spacingBetweenRowsCmMax: 50,
  },

  seedPrep: {
    solution: "100 l vode + Funomil 100 g + Signum 80 g",
    soakMinutes: 45,
    notes:
      "Rasčešljen luk u mrežastom džaku, potopiti uz mešanje, izvaditi i sušiti na provetrenom mestu.",
  },

  soilPrep: {
    plowingDepthCm: 20,
    seedbedDepthCmMin: 8,
    seedbedDepthCmMax: 10,
    notes:
      "Sitno-mrvičasti rastresiti sloj 8–10 cm; pokrovni sloj 2–3 cm iznad vrha čena pri sadnji.",
  },

  fertilization: {
    baseNpkFormulas: ["8:16:24", "6:12:24", "7:14:21"],
    baseNpkKgPerHaMin: 400,
    baseNpkKgPerHaMax: 500,
    baseNotes:
      "1/3 azota + sav fosfor i kalijum pri osnovnoj obradi. Preostali azot u proleće kad krene vegetacija.",
    sulfur:
      "Velike količine sumpora — K2SO4 u NPK ili (NH4)2SO4 / fertigacija u proleće.",
    basedOnAnalysis: true,
  },

  herbicides: {
    preEmergence: {
      product: "Stomp aqua (pendimetalin 455 g/l)",
      dose: "25–30 ml / 100 m²",
    },
    spring: {
      product: "Fusilade (fluazifop-p-butil 150 g/l)",
      dose: "1,2 l/ha",
      timing: "Druga polovina marta, pri pojavi korova",
      note: "Može blago usporiti rast luka.",
    },
    springAlternative: {
      product: "Select Super (kletodim)",
      dose: "1,2 l/ha",
      note: "Za uskolisne korove bez zaustavljanja rasta luka.",
    },
    applicationRules: [
      "Ne tretirati posle kiše — sačekati 2 dana da se formira voštana prevlaka.",
      "Korove tretirati u ranoj fazi razvoja; prerano tretiranje (tek nikli) — mehanički.",
    ],
  },

  pests: {
    onionFly: {
      name: "Lukova muva (Delia antiqua / Hylemya antiqua)",
      trap:
        "Žuta činija: voda + 2 kapi deterdženta + sirće + 2 izgnječena čena luka.",
      threshold: "Više od 1 muve u klopci → tretman",
      treatments: [
        "Šiman 10 g + Lambda 4 ml / 10 l",
        "Šiman 10 g + Cipkord 20 EC 3 ml / 10 l",
        "Šiman 10 g + Polux EC 9 ml / 10 l",
      ],
    },
    leafMiner: {
      name: "Minirajuća muva luka (Napomyza gymnostoma)",
      note: "Isti preparati kao protiv lukove muve.",
    },
  },

  diseases: {
    rust: {
      name: "Lukova rđa",
      conditions: "Proleće, kiše, velike dnevno-noćne razlike temperature",
      treatment: "Elatus Era 30 ml / 10 l vode",
      lateSeason: "Quadris ili Promesa (azoksistrobin) — kraća karenca pred berbu",
    },
    rot: {
      name: "Trulež",
      timing: "3–4 nedelje pre vađenja",
      treatments: [
        "Switch 62,5 WG 10 g / 10 l",
        "Signum 30 g / 10 l (~1,5–1,8 kg/ha)",
      ],
    },
  },

  sprayerNotes: {
    adjuvant: "Magis 1 ml / 1 l vode (okvašivač, posebno kod tvrde vode)",
    general:
      "Poštovati uputstva proizvođača, max broj tretmana i karencu po preparatu.",
  },
} as const;
