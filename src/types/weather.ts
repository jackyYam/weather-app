/**
 * OpenWeather API Type Definitions
 *
 * Based on official OpenWeather API documentation:
 * - Current Weather: https://openweathermap.org/current
 * - 5 Day / 3 Hour Forecast: https://openweathermap.org/forecast5
 */

// ===== SHARED/COMMON TYPES =====

export interface Coordinates {
  lon: number;
  lat: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface Rain {
  "1h"?: number;
  "3h"?: number;
}

export interface Snow {
  "1h"?: number;
  "3h"?: number;
}

export interface City {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise?: number;
  sunset?: number;
}

// ===== CURRENT WEATHER API TYPES =====

export interface CurrentWeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface CurrentWeatherSys {
  type?: number;
  id?: number;
  message?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: CurrentWeatherMain;
  visibility: number;
  wind: Wind;
  rain?: Rain;
  snow?: Snow;
  clouds: Clouds;
  dt: number;
  sys: CurrentWeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// ===== 5 DAY / 3 HOUR FORECAST API TYPES =====

export interface ForecastMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level?: number;
  grnd_level?: number;
  humidity: number;
  temp_kf: number; // Temperature correction factor
}

export interface ForecastSys {
  pod: string; // Part of day (n - night, d - day)
}

export interface ForecastItem {
  dt: number; // Time of data forecasted, unix, UTC
  main: ForecastMain;
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number; // Probability of precipitation (0 to 1)
  icon: string; // icon code
  rain?: {
    "3h"?: number; // Rain volume for the last 3 hours
  };
  snow?: {
    "3h"?: number; // Snow volume for the last 3 hours
  };
  sys: ForecastSys;
  dt_txt: string; // Time of data forecasted, ISO, UTC
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number; // Number of forecast items
  list: ForecastItem[];
  city: City;
}

// ===== UTILITY TYPES FOR YOUR APP =====

/**
 * Simplified types that match your current mock data structure
 * You can use these to transform API responses to your app's internal format
 */
export interface AppCurrentWeather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  clouds: number;
  icon: string;
  feelsLike: number;
  max: number;
  min: number;
  cityName?: string;
  timezone: number; // Offset from UTC in seconds
}

export interface AppHourlyForecast {
  time: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  clouds: number;
  icon: string;
  timezone: number; // Offset from UTC in seconds
}

export interface AppDailyForecast {
  day: string;
  condition: string;
  high: number;
  low: number;
  icon: string; // icon code
}

export interface AppWeatherData {
  current: AppCurrentWeather;
  hourly: AppHourlyForecast[];
  daily: AppDailyForecast[];
}

// ===== TRANSFORMATION HELPER TYPES =====

/**
 * Helper type to extract hourly forecasts from the 5-day/3-hour forecast
 * You can use this to get the next 24 hours of data
 */
export type HourlyForecastExtract = Pick<
  ForecastItem,
  "dt" | "main" | "weather" | "pop"
>;

/**
 * Helper type to extract daily forecasts from the 5-day/3-hour forecast
 * You can aggregate 3-hour intervals to create daily summaries
 */
export type DailyForecastExtract = {
  date: string;
  forecasts: ForecastItem[]; // All 3-hour forecasts for the day
};

// ===== API ERROR RESPONSE TYPE =====

export interface WeatherApiError {
  cod: number;
  message: string;
}

// ===== UTILITY FUNCTIONS TYPE DEFINITIONS =====

export type WeatherUnits = "standard" | "metric" | "imperial";
export type WeatherLanguage =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ru"
  | "zh_cn"
  | "ja"
  | "ar";

export interface WeatherApiParams {
  lat: number;
  lon: number;
  appid: string;
  units?: WeatherUnits;
  lang?: WeatherLanguage;
}
