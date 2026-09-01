export type WeatherDay = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  weatherCode: number;
};

export type WeatherForecast = {
  days: WeatherDay[];
  irrigationRecommendation: string;
};

export const JAKOVO = {
  name: "Jakovo",
  latitude: 44.7528,
  longitude: 20.6064,
} as const;

const WEATHER_CODES: Record<number, string> = {
  0: "Vedro",
  1: "Pretežno vedro",
  2: "Delimično oblačno",
  3: "Oblačno",
  45: "Magla",
  48: "Magla",
  51: "Slaba rosulja",
  61: "Slab kiš",
  63: "Umeren kiš",
  65: "Jak kiš",
  80: "Pljuskovi",
};

export function getWeatherDescription(code: number): string {
  return WEATHER_CODES[code] ?? "Nepoznato";
}

export function getWeatherEmoji(code: number): string {
  if (code === 0 || code === 1) return "☀️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code === 51) return "🌦️";
  if (code === 61 || code === 63) return "🌧️";
  if (code === 65 || code === 80) return "🌧️";
  return "🌤️";
}

export const FORECAST_DAYS = 15;

export async function fetchJakovoWeatherForecast(
  forecastDays = FORECAST_DAYS,
): Promise<WeatherForecast> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", JAKOVO.latitude.toString());
  url.searchParams.set("longitude", JAKOVO.longitude.toString());
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
  );
  url.searchParams.set("timezone", "Europe/Belgrade");
  url.searchParams.set("forecast_days", String(forecastDays));

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Neuspešno učitavanje vremenske prognoze.");
  }

  const data = await response.json();
  const daily = data.daily;

  const days: WeatherDay[] = daily.time.map((date: string, i: number) => ({
    date,
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
    precipitation: daily.precipitation_sum[i],
    weatherCode: daily.weathercode[i],
  }));

  const dryDays = days.filter((d) => d.precipitation < 1).length;
  const rainyDays = days.filter((d) => d.precipitation >= 5).length;
  const nearTerm = days.slice(0, 7);
  const nearRainy = nearTerm.filter((d) => d.precipitation >= 5).length;
  const nearDry = nearTerm.filter((d) => d.precipitation < 1).length;

  let irrigationRecommendation: string;
  if (nearRainy >= 3) {
    irrigationRecommendation =
      "Kišni period u narednih 7 dana — navodnjavanje verovatno nije potrebno.";
  } else if (nearDry >= 5) {
    irrigationRecommendation =
      "Sušan period u narednih 7 dana — preporučeno navodnjavanje sutra ujutru.";
  } else if (rainyDays >= 8) {
    irrigationRecommendation =
      `Kišnije u narednih ${days.length} dana (${rainyDays} kišna) — prati vlagu, zalivaj po potrebi.`;
  } else if (dryDays >= 10) {
    irrigationRecommendation =
      `Sušnije u narednih ${days.length} dana (${dryDays} suva) — planiraj redovno navodnjavanje.`;
  } else {
    irrigationRecommendation =
      "Umereni uslovi — proverite vlagu zemljišta pre zalivanja.";
  }

  return { days, irrigationRecommendation };
}
