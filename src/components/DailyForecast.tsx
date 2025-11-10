import { useAppSelector } from "../app/hooks";
import type { RootState } from "../app/store";
import RetrieveDateTime from "../util/processDateTime";
import Loading from "./Loading";

function DailyForecast() {
  const weather = useAppSelector((state: RootState) => state.weather.data);
  const status = useAppSelector((state: RootState) => state.weather.status);
  if (status === "loading") {
    return (
      <div className="bg-[#1a1f35] rounded-2xl p-5 text-gray-200 w-full max-w-xs mx-auto shadow-md mt-5"></div>
    );
  }
  const forecast = [
    { day: "Tue", icon: "/src/assets/icon-rain.webp", high: "20°", low: "14°" },
    { day: "Wed", icon: "/src/assets/icon-snow.webp", high: "21°", low: "15°" },
    {
      day: "Thu",
      icon: "/src/assets/icon-sunny.webp",
      high: "24°",
      low: "14°",
    },
    {
      day: "Fri",
      icon: "/src/assets/icon-partly-cloudy.webp",
      high: "25°",
      low: "13°",
    },
    {
      day: "Sat",
      icon: "/src/assets/icon-storm.webp",
      high: "21°",
      low: "15°",
    },
    {
      day: "Sun",
      icon: "/src/assets/icon-partly-cloudy.webp",
      high: "25°",
      low: "16°",
    },
    { day: "Mon", icon: "/src/assets/icon-fog.webp", high: "24°", low: "15°" },
  ];

  const daily = weather && weather.daily ? weather.daily : null;
  const dailyUnits =
    weather && weather.daily_units ? weather.daily_units : null;
  const daysCount = daily?.time?.length ?? forecast.length;
  const weatherIcons = Array.from({ length: daysCount }).map((_, i) => {
    const precip = Number(daily?.precipitation_sum?.[i] ?? 0); // mm (or 0)
    const tMin = Number(daily?.temperature_2m_min?.[i] ?? NaN);
    const tMax = Number(daily?.temperature_2m_max?.[i] ?? NaN);
    // fallback wind: use current weather windspeed if no daily wind available
    const wind =
      Number((daily as any)?.wind_speed_10m_max?.[i] ?? NaN) ||
      Number(weather?.current_weather?.windspeed ?? 0);

    // decision rules (tweak thresholds as needed)
    if (!isNaN(precip) && precip >= 5) return "/src/assets/icon-storm.webp";
    if (!isNaN(precip) && precip > 0.5) return "/src/assets/icon-rain.webp";
    if (!isNaN(tMax) && tMax >= 30) return "/src/assets/icon-sunny.webp";
    if (!isNaN(tMin) && tMin <= 0) return "/src/assets/icon-snow.webp";
    if (!isNaN(wind) && wind >= 15)
      return "/src/assets/icon-partly-cloudy.webp";
    // default fallback
    return forecast?.[i]?.icon ?? "/src/assets/icon-partly-cloudy.webp";
  });

  return (
    <div className="mt-8">
      <h2 className="text-gray-300 font-medium mb-4">Daily forecast</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {daily?.temperature_2m_min.map((item, index) => (
          <div
            key={index}
            className="bg-[#1a1f35] text-gray-200 rounded-xl p-4 flex flex-col items-center justify-between text-center shadow-sm"
          >
            <p className="font-medium mb-2 text-gray-300">
              {RetrieveDateTime(daily.time[index])?.weekday}
            </p>
            <img src={weatherIcons[index]} className="h-8 w-8 mb-2" />
            <div className="flex items-center space-x-1 text-sm">
              <span className="font-semibold">
                {Math.round(Number(item))}

                {dailyUnits?.temperature_2m_min}
              </span>

              <span>-</span>
              <span className="text-gray-400">
                {Math.round(Number(daily.temperature_2m_max[index]))}
                {dailyUnits?.temperature_2m_max}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyForecast;
