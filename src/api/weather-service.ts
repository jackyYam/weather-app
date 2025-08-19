import type { AppWeatherData, WeatherApiParams } from "../types/weather";
import { getCurrentWeather } from "./get-current-weather";
import {
  getHourlyForecast,
  getDailyForecast,
  getForecastByCity,
} from "./get-forecast";

/**
 * Comprehensive weather service that fetches all weather data for a location
 */
export async function getCompleteWeatherData(
  params: Pick<WeatherApiParams, "lat" | "lon" | "appid"> &
    Partial<Pick<WeatherApiParams, "units" | "lang">>
): Promise<AppWeatherData> {
  try {
    // Fetch all data in parallel for better performance
    const [current, hourly, daily] = await Promise.all([
      getCurrentWeather(params),
      getHourlyForecast(params),
      getDailyForecast(params),
    ]);

    return {
      current,
      hourly,
      daily,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
    throw new Error("Failed to fetch weather data");
  }
}

/**
 * Get complete weather data by city name
 */
export async function getCompleteWeatherDataByCity(
  cityName: string,
  params: Pick<WeatherApiParams, "appid"> &
    Partial<Pick<WeatherApiParams, "units" | "lang">>
): Promise<AppWeatherData> {
  try {
    // First get the forecast to extract coordinates for consistent data
    const forecastData = await getForecastByCity(cityName, params);
    const { lat, lon } = forecastData.city.coord;

    // Now fetch all data using coordinates for consistency
    const coordParams = {
      ...params,
      lat,
      lon,
    };

    return await getCompleteWeatherData(coordParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to fetch weather data for ${cityName}: ${error.message}`
      );
    }
    throw new Error(`Failed to fetch weather data for ${cityName}`);
  }
}

/**
 * Utility function to get weather data for multiple cities
 */
export async function getWeatherForMultipleCities(
  cities: string[],
  params: Pick<WeatherApiParams, "appid"> &
    Partial<Pick<WeatherApiParams, "units" | "lang">>
): Promise<Record<string, AppWeatherData>> {
  const weatherPromises = cities.map(async (city) => {
    try {
      const data = await getCompleteWeatherDataByCity(city, params);
      return { city, data };
    } catch (error) {
      console.error(`Failed to fetch weather for ${city}:`, error);
      return { city, data: null };
    }
  });

  const results = await Promise.allSettled(weatherPromises);
  const weatherData: Record<string, AppWeatherData> = {};

  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value.data) {
      weatherData[result.value.city] = result.value.data;
    }
  });

  return weatherData;
}
