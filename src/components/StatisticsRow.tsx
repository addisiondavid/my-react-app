import { useAppSelector } from "../app/hooks";
import type { RootState } from "../app/store";

function StatisticsRow() {
  const weather = useAppSelector((state: RootState) => state.weather.data);
  const status = useAppSelector((state: RootState) => state.weather.status);
  if (status === "loading") {
    return (
      <div className="bg-[#1a1f35] rounded-2xl p-5 text-gray-200 w-full max-w-xs mx-auto shadow-md mt-5"></div>
    );
  }

  const weatherInfo =
    weather && weather.current_weather ? weather.current_weather : null;
  const weatherInfoUnits =
    weather && weather.current_weather_units
      ? weather.current_weather_units
      : null;
  const weatherDailyInfo = weather && weather.daily ? weather.daily : null;
  const weatherhourlyInfo = weather && weather.hourly ? weather.hourly : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full">
      <div className="bg-[#1a1f35] text-gray-200 rounded-xl p-4 shadow-sm text-center">
        <p className="text-sm text-gray-400">Feels Like</p>
        <p className="text-2xl font-semibold mt-2">
          {weatherInfo?.temperature} {weatherInfoUnits?.temperature}
        </p>
      </div>
      <div className="bg-[#1a1f35] text-gray-200 rounded-xl p-4 shadow-sm text-center">
        <p className="text-sm text-gray-400">Humidity</p>
        <p className="text-2xl font-semibold mt-2">
          {weatherhourlyInfo?.relative_humidity_2m[0]}%
        </p>
      </div>
      <div className="bg-[#1a1f35] text-gray-200 rounded-xl p-4 shadow-sm text-center">
        <p className="text-sm text-gray-400">Wind</p>
        <p className="text-2xl font-semibold mt-2">
          {weatherInfo?.windspeed} {weatherInfoUnits?.windspeed}
        </p>
      </div>
      <div className="bg-[#1a1f35] text-gray-200 rounded-xl p-4 shadow-sm text-center">
        <p className="text-sm text-gray-400">Precipitation</p>
        <p className="text-2xl font-semibold mt-2">
          {weatherDailyInfo?.precipitation_sum[0]} in
        </p>
      </div>
    </div>
  );
}

export default StatisticsRow;
