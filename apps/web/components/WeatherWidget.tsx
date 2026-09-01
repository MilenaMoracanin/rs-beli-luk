import { FORECAST_DAYS, getWeatherDescription, getWeatherEmoji, JAKOVO } from "@/lib/weather";

type WeatherDay = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  weatherCode: number;
};

type WeatherWidgetProps = {
  days: WeatherDay[];
  irrigationRecommendation: string;
};

function formatDayLabel(date: string): { weekday: string; dateLine: string } {
  const d = new Date(`${date}T12:00:00`);
  return {
    weekday: d.toLocaleDateString("sr-RS", { weekday: "long" }),
    dateLine: d.toLocaleDateString("sr-RS", { day: "numeric", month: "short" }),
  };
}

function WeatherDayCard({ day, index }: { day: WeatherDay; index: number }) {
  const { weekday, dateLine } = formatDayLabel(day.date);
  const isToday = index === 0;
  const rainy = day.precipitation >= 1;

  return (
    <article
      className={`flex h-full w-[8.75rem] shrink-0 snap-start flex-col rounded-xl border bg-white/90 p-4 shadow-sm sm:w-[9.5rem] ${
        isToday ? "border-sky-500" : "border-sky-100"
      }`}
    >
      <div className="text-center">
        <p className="text-sm font-semibold capitalize text-gray-900">
          {isToday ? "Danas" : weekday}
        </p>
        <p className="text-xs text-gray-500">{dateLine}</p>
      </div>

      <p className="mt-3 text-center text-3xl leading-none" aria-hidden>
        {getWeatherEmoji(day.weatherCode)}
      </p>
      <p className="mt-2 min-h-[2.5rem] text-center text-xs leading-snug text-gray-600">
        {getWeatherDescription(day.weatherCode)}
      </p>

      <div className="mt-auto pt-4 text-center">
        <p className="text-2xl font-bold tabular-nums text-gray-900">
          {Math.round(day.tempMax)}°
        </p>
        <p className="text-sm tabular-nums text-gray-400">{Math.round(day.tempMin)}° min</p>
        <p
          className={`mt-2 text-xs font-medium ${rainy ? "text-sky-700" : "text-gray-400"}`}
        >
          {rainy ? `${day.precipitation.toFixed(1)} mm` : "Bez kiše"}
        </p>
      </div>
    </article>
  );
}

export function WeatherWidget({ days, irrigationRecommendation }: WeatherWidgetProps) {
  const dayCount = days.length || FORECAST_DAYS;

  return (
    <div className="rounded-xl border border-sky-200 bg-gradient-to-b from-sky-50 to-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-sky-950">Prognoza</h3>
          <p className="mt-0.5 text-sm text-sky-700">
            {JAKOVO.name} · {dayCount} dana
          </p>
        </div>
        <p className="text-xs text-sky-600">Prevuci za više dana →</p>
      </div>

      <p className="mt-4 rounded-lg border border-sky-200 bg-white/80 px-4 py-3 text-sm leading-relaxed text-sky-900">
        {irrigationRecommendation}
      </p>

      <div className="relative mt-5">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent" />

        <div className="flex gap-3 overflow-x-auto scroll-px-1 p-1 pb-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:thin]">
          {days.map((day, index) => (
            <WeatherDayCard key={day.date} day={day} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
