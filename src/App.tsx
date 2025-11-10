import { useState } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import WeatherCard from "./components/WeatherCard";
import StatisticsRow from "./components/StatisticsRow";
import DailyForecast from "./components/DailyForecast";
import HourlyForecast from "./components/HourlyForecast";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchWeather } from "./features/weather/weatherSlice";

import "./App.css";
import Lottie from "lottie-react";
import sunnyAnim from "./assets/sunny.json";

function App() {
  const dispatch = useAppDispatch();
  const { units, status, error, data } = useAppSelector((s) => s.weather);

  useEffect(() => {
    // Example: fetch Berlin weather on initial load
    console.log("Fetching weather for Berlin", units);
    const berlin = { lat: 52.52, lon: 13.41 };
    dispatch(fetchWeather({ lat: berlin.lat, lon: berlin.lon, units }));
  }, [dispatch, units]);

  return (
    <div className="App bg-[#0b1120] min-h-screen text-white px-4 py-6">
      <Header />

      <div className="px-4 py-4 text-center text-4xl font-bold text-white text-center">
        <p>Hows the sky looking today?</p>
      </div>

      <main className="p-4">
        <div className="flex items-center justify-center gap-12 mb-6">
          <Search />
          <div className="hidden sm:block">
            <Lottie
              animationData={sunnyAnim}
              loop
              style={{ width: 80, height: 80 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-10 ">
          <div className="lg:col-span-8 space-y-6">
            <WeatherCard />
            <StatisticsRow />
            <DailyForecast />
          </div>
          <aside className="lg:col-span-4">
            <HourlyForecast />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
