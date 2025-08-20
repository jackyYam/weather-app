import type {
  CurrentWeatherResponse,
  AppCurrentWeather,
  WeatherApiParams,
  WeatherApiError,
} from "../types/weather";
import { WEATHER_API_CONFIG } from "./config";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Fetches current weather data from OpenWeather API
 */
export async function getCurrentWeather(
  params: Pick<WeatherApiParams, "lat" | "lon"> &
    Partial<Pick<WeatherApiParams, "units" | "lang">>
): Promise<AppCurrentWeather> {
  const {
    lat,
    lon,
    units = WEATHER_API_CONFIG.defaultUnits,
    lang = WEATHER_API_CONFIG.defaultLanguage,
  } = params;

  const url = new URL(`${API_BASE_URL}/weather`);
  url.searchParams.set("lat", lat.toString());
  url.searchParams.set("lon", lon.toString());
  url.searchParams.set("appid", WEATHER_API_CONFIG.apiKey);
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData: WeatherApiError = await response.json();
      throw new Error(
        `Weather API Error: ${errorData.message} (Code: ${errorData.cod})`
      );
    }

    const data: CurrentWeatherResponse = await response.json();
    return transformCurrentWeatherData(data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch current weather data");
  }
}

/**
 * Transforms OpenWeather API current weather response to app's internal format
 */
function transformCurrentWeatherData(
  data: CurrentWeatherResponse
): AppCurrentWeather {
  return {
    temp: Math.round(data.main.temp),
    condition: data.weather[0]?.description || "Unknown",
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed),
    icon: data.weather[0]?.icon || "01d",
    feelsLike: Math.round(data.main.feels_like),
    max: Math.round(data.main.temp_max),
    min: Math.round(data.main.temp_min),
    clouds: data.clouds.all,
    cityName: data.name,
    timezone: data.timezone,
  };
}

/**
 * Alternative function to get current weather by city name (uses geocoding)
 */
export async function getCurrentWeatherByCity(
  cityName: string,
  params: Pick<WeatherApiParams, "appid"> &
    Partial<Pick<WeatherApiParams, "units" | "lang">>
): Promise<AppCurrentWeather> {
  const { appid, units = "metric", lang = "en" } = params;

  const url = new URL(`${API_BASE_URL}/weather`);
  url.searchParams.set("q", cityName);
  url.searchParams.set("appid", appid);
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData: WeatherApiError = await response.json();
      throw new Error(
        `Weather API Error: ${errorData.message} (Code: ${errorData.cod})`
      );
    }

    const data: CurrentWeatherResponse = await response.json();
    return transformCurrentWeatherData(data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to fetch weather data for ${cityName}`);
  }
}
