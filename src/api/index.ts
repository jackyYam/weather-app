// Export all API functions for easy importing
export {
  getCurrentWeather,
  getCurrentWeatherByCity,
} from "./get-current-weather";
export {
  getForecast,
  getHourlyForecast,
  getDailyForecast,
  getForecastByCity,
} from "./get-forecast";
export {
  getCompleteWeatherData,
  getCompleteWeatherDataByCity,
  getWeatherForMultipleCities,
} from "./weather-service";

// Re-export types for convenience
export type {
  CurrentWeatherResponse,
  ForecastResponse,
  ForecastItem,
  AppWeatherData,
  AppCurrentWeather,
  AppHourlyForecast,
  AppDailyForecast,
  WeatherApiParams,
  WeatherUnits,
  WeatherLanguage,
} from "../types/weather";
