/**
 * Weather API Configuration
 *
 * Add your OpenWeather API key to your environment variables:
 * VITE_OPENWEATHER_API_KEY=your_api_key_here
 */

export const WEATHER_API_CONFIG = {
  // Get your free API key from: https://openweathermap.org/api
  apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || "",

  // Default settings
  defaultUnits: "metric" as const,
  defaultLanguage: "en" as const,

  // API endpoints
  baseUrl: "https://api.openweathermap.org/data/2.5",

  // Cache settings (in milliseconds)
  cacheTimeout: 10 * 60 * 1000, // 10 minutes
} as const;

/**
 * Validates that the API key is configured
 */
export function validateApiKey(): void {
  if (!WEATHER_API_CONFIG.apiKey) {
    throw new Error(
      "OpenWeather API key not found. Please add VITE_OPENWEATHER_API_KEY to your .env file"
    );
  }
}

/**
 * Gets API parameters with defaults
 */
export function getDefaultApiParams() {
  validateApiKey();

  return {
    appid: WEATHER_API_CONFIG.apiKey,
    units: WEATHER_API_CONFIG.defaultUnits,
    lang: WEATHER_API_CONFIG.defaultLanguage,
  };
}
