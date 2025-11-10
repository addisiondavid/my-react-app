import { useAppSelector } from "../app/hooks";
import type { RootState } from "../app/store";
import RetrieveDateTime from "../util/processDateTime";
import { lookupCity } from "../util/cityList";
import Loading from "./Loading";

function WeatherCard() {
  const weather = useAppSelector((state: RootState) => state.weather.data);
  const status = useAppSelector((state: RootState) => state.weather.status);
  const city = useAppSelector((state: RootState) => state.weather.city);
  const daily = weather && weather.daily ? weather.daily : null;
  const dailyUnits =
    weather && weather.daily_units ? weather.daily_units : null;

  const daysCount = daily?.time?.length ?? 5;
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
    return "/src/assets/icon-partly-cloudy.webp";
  });

  console.log(weatherIcons);
  // show loading placeholder while fetching or empty if no data yet
  if (status === "loading" || !weather) {
    return (
      <div className="relative w-full rounded-3xl overflow-hidden shadow-lg mt-5 bg-[#0b1220]">
        <div className="p-6">
          <Loading />
        </div>
      </div>
    );
  }
  const dateInfo =
    weather && weather.current_weather?.time
      ? RetrieveDateTime(weather.current_weather.time)
      : null;

  const cityInfo = city ? lookupCity(city) : null;
  const displayCity = (() => {
    if (!city) return "Berlin, Germany";
    // pretty-capitalize words in the stored city string
    const pretty = city
      .split(" ")
      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
    return cityInfo?.country ? `${pretty}, ${cityInfo.country}` : pretty;
  })();
  return (
    <div className="relative w-full w-full rounded-3xl overflow-hidden shadow-lg mt-5">
      {/* Background image */}
      <img
        src="/src/assets/bg-today-large.svg"
        alt="Weather background"
        className="w-full h-56 object-cover"
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
        <div>
          <h2 className="text-xl font-semibold">{displayCity} </h2>
          <p className="text-gray-200 text-sm">
            {dateInfo
              ? `${dateInfo.weekday}, ${dateInfo.month} ${dateInfo.date}, ${dateInfo.year}`
              : "Loading..."}
          </p>
        </div>

        <div className="flex items-center justify-end">
          <img src={weatherIcons[0]} alt="sun" className="h-10 w-10" />
          <span className="text-5xl font-bold ml-2">
            {weather ? weather.current_weather.temperature : "—"}°
          </span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
