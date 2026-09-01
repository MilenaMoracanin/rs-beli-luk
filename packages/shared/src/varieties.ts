export type GarlicVariety = {
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

export const GARLIC_VARIETIES: GarlicVariety[] = [
  {
    id: "beli-bosnian",
    name: "Beli Bosnian",
    daysToHarvest: 260,
    spacingCm: 10,
    rowSpacingCm: 28,
    plantingDepthCm: 4,
    yieldMinKgPerHa: 3000,
    yieldMaxKgPerHa: 5000,
    description: "Lokalna sorta, dobar prinos i skladištenje.",
  },
  {
    id: "zajecar",
    name: "Zaječar",
    daysToHarvest: 250,
    spacingCm: 10,
    rowSpacingCm: 30,
    plantingDepthCm: 4,
    yieldMinKgPerHa: 3500,
    yieldMaxKgPerHa: 6000,
    description: "Sorta sa snažnim čenovima, pogodna za 10 ari.",
  },
  {
    id: "lokalna",
    name: "Lokalna sorta",
    daysToHarvest: 255,
    spacingCm: 10,
    rowSpacingCm: 28,
    plantingDepthCm: 4,
    yieldMinKgPerHa: 3000,
    yieldMaxKgPerHa: 5500,
    description: "Prilagođena lokalnim uslovima.",
  },
];

export function getVarietyById(id: string): GarlicVariety | undefined {
  return GARLIC_VARIETIES.find((v) => v.id === id);
}
