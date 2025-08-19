import type {
  ForecastResponse,
  ForecastItem,
  AppHourlyForecast,
  AppDailyForecast,
  WeatherApiParams,
  WeatherApiError,
} from "../types/weather";

const API_BASE_URL = "https://api.openweathermap.org/data/2.5";
import { WEATHER_API_CONFIG } from "./config";

/**
 * Fetches 5-day/3-hour forecast data from OpenWeather API
 */
export async function getForecast(
  params: Pick<WeatherApiParams, "lat" | "lon"> &
    Partial<Pick<WeatherApiParams, "units" | "lang">>
): Promise<ForecastResponse> {
  const { lat, lon, units = "metric", lang = "en" } = params;

  const url = new URL(`${API_BASE_URL}/forecast`);
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
        `Forecast API Error: ${errorData.message} (Code: ${errorData.cod})`
      );
    }

    const data: ForecastResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch forecast data");
  }
}

/**
 * Gets hourly forecast data (next 24 hours) from 5-day forecast
 */
export async function getHourlyForecast(
  params: Pick<WeatherApiParams, "lat" | "lon"> &
    Partial<Pick<WeatherApiParams, "units" | "lang">>
): Promise<AppHourlyForecast[]> {
  const forecastData = await getForecast(params);

  // Get next 8 forecast items (24 hours in 3-hour intervals)
  const hourlyItems = forecastData.list.slice(0, 8);

  return transformHourlyForecastData(hourlyItems);
}

/**
 * Gets daily forecast data (next 5 days) from 5-day forecast
 */
export async function getDailyForecast(
  params: Pick<WeatherApiParams, "lat" | "lon"> &
    Partial<Pick<WeatherApiParams, "units" | "lang">>
): Promise<AppDailyForecast[]> {
  const forecastData = await getForecast(params);
  return transformDailyForecastData(forecastData.list);
}

/**
 * Alternative function to get forecast by city name
 */
export async function getForecastByCity(
  cityName: string,
  params: Pick<WeatherApiParams, "appid"> &
    Partial<Pick<WeatherApiParams, "units" | "lang">>
): Promise<ForecastResponse> {
  const { appid, units = "metric", lang = "en" } = params;

  const url = new URL(`${API_BASE_URL}/forecast`);
  url.searchParams.set("q", cityName);
  url.searchParams.set("appid", appid);
  url.searchParams.set("units", units);
  url.searchParams.set("lang", lang);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData: WeatherApiError = await response.json();
      throw new Error(
        `Forecast API Error: ${errorData.message} (Code: ${errorData.cod})`
      );
    }

    const data: ForecastResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to fetch forecast data for ${cityName}`);
  }
}

/**
 * Transforms forecast items to hourly format for the app
 */
function transformHourlyForecastData(
  items: ForecastItem[]
): AppHourlyForecast[] {
  return items.map((item) => {
    const date = new Date(item.dt * 1000);
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return {
      time,
      temp: Math.round(item.main.temp),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      clouds: item.clouds.all,
      icon: item.weather[0]?.icon || "01d",
    };
  });
}

/**
 * Transforms forecast items to daily format for the app
 * Groups 3-hour forecasts by day and aggregates data
 */
function transformDailyForecastData(items: ForecastItem[]): AppDailyForecast[] {
  // Group forecasts by date
  const dailyGroups = groupForecastsByDate(items);

  return dailyGroups.map((group) => {
    // Parse date parts to avoid timezone issues
    const [year, month, dayNum] = group.date.split("-").map(Number);
    const date = new Date(year, month - 1, dayNum); // month is 0-indexed
    const day = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    // Calculate high/low temperatures for the day
    const temps = group.forecasts.map((f) => f.main.temp);
    const icons = group.forecasts.map((f) => f.weather[0]?.icon || "01d");
    const high = Math.round(Math.max(...temps));
    const low = Math.round(Math.min(...temps));

    // Get the most common weather condition for the day
    const conditions = group.forecasts.map(
      (f) => f.weather[0]?.description || ""
    );
    const condition = getMostFrequent(conditions);

    return {
      day,
      condition: condition || "Unknown",
      high,
      low,
      icon: icons[0] || "01d",
    };
  });
}

/**
 * Groups forecast items by date
 */
function groupForecastsByDate(items: ForecastItem[]): Array<{
  date: string;
  forecasts: ForecastItem[];
}> {
  const groups = new Map<string, ForecastItem[]>();

  items.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; // Get date part (YYYY-MM-DD)

    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(item);
  });

  return Array.from(groups.entries())
    .filter(([date]) => date !== new Date().toISOString().split("T")[0])
    .map(([date, forecasts]) => ({ date, forecasts }))
    .slice(0, 5); // Limit to 5 days
}

/**
 * Gets the most frequent item in an array
 */
function getMostFrequent<T>(items: T[]): T | undefined {
  const frequency = new Map<T, number>();

  items.forEach((item) => {
    frequency.set(item, (frequency.get(item) || 0) + 1);
  });

  let maxCount = 0;
  let mostFrequent: T | undefined;

  frequency.forEach((count, item) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = item;
    }
  });

  return mostFrequent;
}
