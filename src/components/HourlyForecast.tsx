import { useAppSelector } from "../app/hooks";
import type { RootState } from "../app/store";
import RetrieveDateTime, {
  getHourlyRangeForWeekday,
} from "../util/processDateTime";
import { useState, useRef, useEffect } from "react";
import Loading from "./Loading";

function HourlyForecast() {
  const weather = useAppSelector((state: RootState) => state.weather.data);
  const status = useAppSelector((state: RootState) => state.weather.status);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Tuesday");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const timesAll = weather?.hourly?.time ?? [];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  if (status === "loading") {
    return (
      <div className="bg-[#1a1f35] rounded-2xl p-5 text-gray-200 w-full max-w-xs mx-auto shadow-md mt-5"></div>
    );
  }

  // defensive empty state when no hourly data

  if (!timesAll.length) {
    return (
      <div className="bg-[#1a1f35] rounded-2xl p-5 text-gray-400 w-full max-w-xs mx-auto shadow-md mt-5">
        <div className="text-sm">No hourly data available</div>
      </div>
    );
  }

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const hours = [
    { time: "3 PM", temp: "20°", icon: "/src/assets/icon-partly-cloudy.webp" },
    { time: "4 PM", temp: "20°", icon: "/src/assets/icon-partly-cloudy.webp" },
    { time: "5 PM", temp: "20°", icon: "/src/assets/icon-partly-cloudy.webp" },
    { time: "6 PM", temp: "19°", icon: "/src/assets/icon-partly-cloudy.webp" },
    { time: "7 PM", temp: "18°", icon: "/src/assets/icon-partly-cloudy.webp" },
    { time: "8 PM", temp: "18°", icon: "/src/assets/icon-partly-cloudy.webp" },
    { time: "9 PM", temp: "17°", icon: "/src/assets/icon-partly-cloudy.webp" },
    { time: "10 PM", temp: "17°", icon: "/src/assets/icon-partly-cloudy.webp" },
  ];
  const dateInfo =
    weather && weather.current_weather?.time
      ? RetrieveDateTime(weather.current_weather.time)
      : null;
  const hourly = weather && weather.hourly ? weather.hourly : null;
  const hourlyUnits =
    weather && weather.hourly_units ? weather.hourly_units : null;

  const daysCount = hourly?.time?.length ?? hours.length;
  const weatherIcons = Array.from({ length: daysCount }).map((_, i) => {
    const precip = Number((hourly as any)?.precipitation?.[i] ?? NaN); // if API provides precipitation
    const rh = Number(hourly?.relative_humidity_2m?.[i] ?? NaN); // relative humidity %
    const temp = Number(hourly?.temperature_2m?.[i] ?? NaN); // hourly temperature
    const wind =
      Number((hourly as any)?.wind_speed_10m?.[i] ?? NaN) ||
      Number(weather?.current_weather?.windspeed ?? NaN);

    // precipitation takes priority when available
    if (!isNaN(precip) && precip >= 5) return "/src/assets/icon-storm.webp";
    if (!isNaN(precip) && precip > 0.5) return "/src/assets/icon-rain.webp";

    // fallback: use humidity as a weak indicator of rain if no precip data
    if (isNaN(precip) && !isNaN(rh) && rh >= 90)
      return "/src/assets/icon-rain.webp";

    // temperature-based icons
    if (!isNaN(temp) && temp >= 30) return "/src/assets/icon-sunny.webp";
    if (!isNaN(temp) && temp <= 0) return "/src/assets/icon-snow.webp";

    // wind-based icon
    if (!isNaN(wind) && wind >= 15)
      return "/src/assets/icon-partly-cloudy.webp";

    // default fallback to your static mock hours
    return hours?.[i]?.icon ?? "/src/assets/icon-partly-cloudy.webp";
  });

  // get current weekday
  // get the difference in datetime in hours
  const { start, end } = getHourlyRangeForWeekday(
    timesAll,
    dateInfo?.dateObj ?? new Date(),
    selectedDay
  );

  // slice inclusive: slice(start, end + 1)
  //const temps = (hourly?.temperature_2m ?? []).slice(start, end + 1);
  //const times = timesAll.slice(start, end + 1);
  //const icons = weatherIcons.slice(start, end + 1);
  const temps = (hourly?.temperature_2m ?? []).slice(start, start + 9);
  const times = timesAll.slice(start, start + 9);
  const icons = weatherIcons.slice(start, start + 9);

  return (
    <div className="bg-[#1a1f35] rounded-2xl p-5 text-gray-200 w-full max-w-xs mx-auto shadow-md mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center justify-between mb-4 relative"
          ref={menuRef}
        >
          <h2 className="text-gray-300 font-medium">Hourly forecast</h2>

          <div className="relative ml-4">
            <button
              type="button"
              onClick={() => setMenuOpen((s) => !s)}
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              className="bg-[#252b45] text-gray-300 text-sm px-3 py-1 rounded-md flex items-center space-x-2"
            >
              <span>{selectedDay}</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {menuOpen && (
              <ul
                role="listbox"
                aria-label="Select day"
                className="absolute right-0 mt-2 w-40 bg-[#0b1220] rounded-md shadow-lg z-20 overflow-hidden"
              >
                {weekdays.map((day) => (
                  <li key={day}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selectedDay === day}
                      onClick={() => {
                        setSelectedDay(day);
                        setMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        selectedDay === day
                          ? "bg-[#1f2740] text-white"
                          : "text-gray-300 hover:bg-[#252b45]"
                      }`}
                    >
                      {day}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Hourly list */}
      <div className="flex flex-col space-y-2">
        {temps?.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#232a48] rounded-xl px-4 py-3"
          >
            <div className="flex items-center space-x-3">
              <img src={icons[index]} className="h-5 w-5" />
              {(() => {
                const dt = RetrieveDateTime(times[index]);
                let timeLabel = "—";
                if (dt?.dateObj) {
                  const hour = dt.dateObj.getHours();
                  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
                  const suffix = hour < 12 ? "am" : "pm";
                  timeLabel = `${hour12} ${suffix}`;
                } else {
                  timeLabel = times[index] ?? "—";
                }
                return (
                  <span className="text-sm text-gray-300">{timeLabel}</span>
                );
              })()}
            </div>
            <span className="text-sm font-medium text-gray-200">
              {item} {hourlyUnits?.temperature_2m}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
