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

export async function fetchJakovoWeatherForecast(): Promise<WeatherForecast> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", JAKOVO.latitude.toString());
  url.searchParams.set("longitude", JAKOVO.longitude.toString());
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
  );
  url.searchParams.set("timezone", "Europe/Belgrade");
  url.searchParams.set("forecast_days", "7");

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

  let irrigationRecommendation: string;
  if (rainyDays >= 3) {
    irrigationRecommendation =
      "Kišni period — navodnjavanje verovatno nije potrebno.";
  } else if (dryDays >= 5) {
    irrigationRecommendation =
      "Sušan period — preporučeno navodnjavanje sutra ujutru.";
  } else {
    irrigationRecommendation =
      "Umereni uslovi — proverite vlagu zemljišta pre zalivanja.";
  }

  return { days, irrigationRecommendation };
}
