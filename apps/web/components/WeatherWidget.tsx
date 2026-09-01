import { getWeatherDescription } from "@/lib/weather";

type WeatherWidgetProps = {
  days: {
    date: string;
    tempMax: number;
    tempMin: number;
    precipitation: number;
    weatherCode: number;
  }[];
  irrigationRecommendation: string;
};

export function WeatherWidget({ days, irrigationRecommendation }: WeatherWidgetProps) {
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
      <h3 className="font-semibold text-sky-900">Vremenska prognoza — Jakovo (7 dana)</h3>
      <p className="mt-2 text-sm text-sky-800">{irrigationRecommendation}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => (
          <div
            key={day.date}
            className="rounded-lg bg-white/80 p-2 text-center text-xs"
          >
            <p className="font-medium text-gray-700">
              {new Date(day.date).toLocaleDateString("sr-RS", {
                weekday: "short",
                day: "numeric",
              })}
            </p>
            <p className="mt-1 text-gray-600">
              {getWeatherDescription(day.weatherCode)}
            </p>
            <p className="mt-1 font-bold text-gray-900">
              {Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°
            </p>
            {day.precipitation > 0 && (
              <p className="text-sky-600">{day.precipitation.toFixed(1)} mm</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
