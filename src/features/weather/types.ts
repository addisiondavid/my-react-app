export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
}

export interface CurrentWeatherUnits {
  interval: String;
  is_day: String;
  temperature: String;
  time: String;
  weathercode: String;
  winddirection: String;
  windspeed: String;
}

export interface DailyUnits {
  precipitation_sum: String;
  temperature_2m_max: String;
  temperature_2m_min: String;
  time: String;
}

export interface HourlyUnits {
  relative_humidity_2m: String;
  temperature_2m: String;
  wind_speed_10m: String;
  time: String;
}

export interface WeatherResponse {
  daily_units: DailyUnits;
  hourly_units: HourlyUnits;
  current_weather_units: CurrentWeatherUnits;
  latitude: number;
  longitude: number;
  current_weather: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecast;
}

export type Units = "metric" | "imperial";
