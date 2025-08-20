/**
 * Timezone utility functions for weather app
 */

/**
 * Formats a date in the local timezone of a city
 * @param timestamp Unix timestamp in seconds
 * @param timezoneOffset Timezone offset from UTC in seconds
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatLocalTime(
  timestamp: number,
  timezoneOffset: number,
  options: Intl.DateTimeFormatOptions = {}
): string {
  // Convert Unix timestamp to milliseconds and adjust for timezone
  const utcTime = timestamp * 1000;
  const localTime = new Date(utcTime + timezoneOffset * 1000);

  // Format the date using UTC methods to avoid double timezone conversion
  const year = localTime.getUTCFullYear();
  const month = localTime.getUTCMonth();
  const date = localTime.getUTCDate();
  const hours = localTime.getUTCHours();
  const minutes = localTime.getUTCMinutes();
  const seconds = localTime.getUTCSeconds();

  // Create a new date object with the adjusted time
  const adjustedDate = new Date(year, month, date, hours, minutes, seconds);

  return adjustedDate.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    ...options,
  });
}

/**
 * Formats a date for hourly forecast display
 * @param timestamp Unix timestamp in seconds
 * @param timezoneOffset Timezone offset from UTC in seconds
 * @returns Formatted time string (e.g., "2:00 PM")
 */
export function formatHourlyTime(
  timestamp: number,
  timezoneOffset: number
): string {
  return formatLocalTime(timestamp, timezoneOffset, {
    hour12: true,
    hour: "numeric",
  });
}

/**
 * Gets the current local time for a timezone
 * @param timezoneOffset Timezone offset from UTC in seconds
 * @returns Current local time as Date object
 */
export function getCurrentLocalTime(timezoneOffset: number): Date {
  const now = Date.now();
  const utcNow = now;
  const localNow = new Date(utcNow + timezoneOffset * 1000);

  return localNow;
}

/**
 * Formats the current time for display in CurrentWeather component
 * @param timezoneOffset Timezone offset from UTC in seconds
 * @returns Formatted current time string
 */
export function formatCurrentLocalTime(timezoneOffset: number): string {
  const now = Math.floor(Date.now() / 1000); // Current Unix timestamp
  return formatLocalTime(now, timezoneOffset, {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });
}
