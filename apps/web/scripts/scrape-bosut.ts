#!/usr/bin/env tsx
/**
 * Scraper za sortu Bosut — preuzima javne izvore i ažurira raw snapshot.
 * Pokretanje: npm run scrape:bosut --workspace=web
 */

import fs from "fs";
import path from "path";

const SOURCES = [
  { id: "ns-seme-bosut", url: "https://prodaja.nsseme.com/povrce-i-cvece/beli-luk/bosut/" },
  { id: "ns-seme-en", url: "https://nsseme.com/en/products/vegetables-and-flovers/vegetables/garlic/" },
  { id: "ns-seme-savet", url: "https://nsseme.com/aktuelno/saveti-strucnjaka/nije-svaki-beli-luk-bosut/" },
  { id: "kurir-2014", url: "https://www.kurir.rs/vesti/srbija/1556935/bosut-jesenji-beli-luk" },
  { id: "agrosmart-2016", url: "https://agrosmart.net/2016/11/07/beli-luk-papreno-skup-a-jos-cemo-jesti-kineski/" },
  { id: "agroinfonet", url: "https://agroinfonet.com/poljoprivreda/povrtarstvo/beli-luk/" },
  { id: "agrovesti-damljanovic", url: "https://agrovesti.rs/sadnja-ozimog-belog-luka/" },
  { id: "plodna-zemlja-tatjana", url: "https://plodnazemlja.com/2023/09/21/tatjana-mandic-iz-banatskog-dvora-nastavili-smo-tradiciju-bake-koje-je-sadila-domacu-sortu-belog-luka-bosut-koja-odlicno-radja-i-otporna-je-na-vremenske-uslove-i-bolesti/" },
  { id: "ekapija-tatjana", url: "https://www.ekapija.com/where-to-invest/4390089/stara-domaca-sorta-belog-luka-otporna-na-bolesti-stabilni-prinos-i-zarada" },
] as const;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractBosutExcerpt(text: string, maxLen = 2000): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf("bosut");
  if (idx === -1) {
    return text.slice(0, maxLen);
  }
  const start = Math.max(0, idx - 400);
  const end = Math.min(text.length, idx + 1600);
  return text.slice(start, end).trim();
}

async function fetchSource(source: (typeof SOURCES)[number]) {
  try {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent": "BeliLuk-ResearchBot/1.0 (educational; +https://github.com/MilenaMoracanin/beli-luk-ekosistem)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return {
        ...source,
        ok: false,
        status: response.status,
        error: `HTTP ${response.status}`,
        scrapedAt: new Date().toISOString(),
      };
    }

    const html = await response.text();
    const text = stripHtml(html);
    const excerpt = extractBosutExcerpt(text);

    return {
      ...source,
      ok: true,
      status: response.status,
      scrapedAt: new Date().toISOString(),
      textLength: text.length,
      excerpt,
    };
  } catch (error) {
    return {
      ...source,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      scrapedAt: new Date().toISOString(),
    };
  }
}

async function main() {
  console.log("Scraping Bosut sources...\n");

  const results = [];
  for (const source of SOURCES) {
    process.stdout.write(`  ${source.id}... `);
    const result = await fetchSource(source);
    results.push(result);
    console.log(result.ok ? "OK" : `FAIL (${"error" in result ? result.error : "unknown"})`);
    await new Promise((r) => setTimeout(r, 500));
  }

  const outputDir = path.join(process.cwd(), "content", "research", "bosut");
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, "scraped-snapshot.json");
  const payload = {
    variety: "Bosut",
    scrapedAt: new Date().toISOString(),
    successCount: results.filter((r) => r.ok).length,
    totalCount: results.length,
    results,
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));

  console.log(`\nSnapshot saved: ${outputPath}`);
  console.log(`${payload.successCount}/${payload.totalCount} sources fetched successfully.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
