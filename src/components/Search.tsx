import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCity, fetchWeather } from "../features/weather/weatherSlice";
import { lookupCity } from "../util/cityList";

function Search() {
  const dispatch = useAppDispatch();
  const units = useAppSelector((s) => s.weather.units);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const city = q.trim();
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      // try local lookup first (fast, no backend)
      const loc = lookupCity(city);
      if (loc) {
        dispatch(setCity(city));
        dispatch(fetchWeather({ lat: loc.lat, lon: loc.lon, units }));
        return;
      }

      // fallback: POST to backend geocode endpoint if local lookup fails
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Server error");
      }

      const data = await res.json();
      if (data?.lat != null && data?.lon != null) {
        dispatch(setCity(city));
        dispatch(
          fetchWeather({ lat: Number(data.lat), lon: Number(data.lon), units })
        );
      } else {
        dispatch(setCity(city));
      }
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center justify-center">
      <div className="flex bg-[#1a1f35] rounded-xl overflow-hidden w-full max-w-xl shadow-md">
        <div className="flex items-center pl-4 text-gray-400">
          <img src="/src/assets/icon-search.svg" alt="Search Icon" />
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="text"
          placeholder="Search for a place..."
          className="w-full bg-transparent text-gray-200 placeholder-gray-400 px-3 py-3 focus:outline-none"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 font-medium transition disabled:opacity-60"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {error && <div className="text-sm text-red-400 mt-2">{error}</div>}
    </form>
  );
}

export default Search;
