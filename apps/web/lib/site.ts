export const SITE_NAME = "RS Beli Luk";
export const SITE_TITLE = "RS Beli Luk — Ekosistem za uzgajanje";
export const SITE_DESCRIPTION =
  "Planer sadnje, održavanja i berbe sorte Bosut. Praćenje 100 kg sadnog materijala.";
export const SEASON_NAME = "Sezona 2026";
export const SEASON_DONE_LABEL = `Urađeno ${SEASON_NAME}`;

export function sezonaItemHref(itemKey: string): string {
  return `/sezona#${itemKey}`;
}
