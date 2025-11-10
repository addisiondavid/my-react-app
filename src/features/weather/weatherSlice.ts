import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { WeatherResponse, Units } from "./types";

interface WeatherState {
  data: WeatherResponse | null;
  units: Units;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  city: string;
}

const initialState: WeatherState = {
  data: null,
  units: "metric",
  status: "idle",
  error: null,
  city: "",
};

export const fetchWeather = createAsyncThunk<
  WeatherResponse,
  { lat: number; lon: number; units: Units }
>("weather/fetchWeather", async ({ lat, lon }) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
  const { data } = await axios.get<WeatherResponse>(url);
  return data;
});

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setUnits: (state, action: PayloadAction<Units>) => {
      state.units = action.payload;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { setUnits, setCity } = weatherSlice.actions;
export default weatherSlice.reducer;
