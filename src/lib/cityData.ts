import type { City } from "../types/city";

export interface CityCSVRow {
  city_id: string;
  city_name: string;
  state_code: string;
  country_code: string;
  country_full: string;
  lat: string;
  lon: string;
}

export function parseCitiesCSV(csvText: string): City[] {
  const lines = csvText.trim().split("\n");
  const cities: City[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handle commas in city names)
    const columns = parseCSVLine(line);
    if (columns.length < 7) continue;

    const [id, city_name, , , country_full, lat, lon] = columns;

    // Convert to our City type
    const city: City = {
      id,
      name: city_name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country: country_full,
    };

    // Validate coordinates
    if (!isNaN(city.lat) && !isNaN(city.lon)) {
      cities.push(city);
    }
  }

  return cities;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export async function loadCities(): Promise<City[]> {
  try {
    const response = await fetch("/cities_20000.csv");
    if (!response.ok) {
      throw new Error("Failed to load cities data");
    }
    const csvText = await response.text();
    return parseCitiesCSV(csvText);
  } catch (error) {
    console.error("Error loading cities:", error);
    return [];
  }
}

export function searchCities(
  query: string,
  cities: City[],
  limit: number = 50
): City[] {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: Array<City & { score: number }> = [];

  for (const city of cities) {
    const cityName = city.name.toLowerCase();
    const countryName = city.country.toLowerCase();

    let score = 0;

    // Exact match gets highest score
    if (cityName === normalizedQuery) {
      score = 1000;
    }
    // Starts with gets high score
    else if (cityName.startsWith(normalizedQuery)) {
      score = 500;
    }
    // Contains gets medium score
    else if (cityName.includes(normalizedQuery)) {
      score = 100;
    }
    // Country match gets lower score
    else if (countryName.includes(normalizedQuery)) {
      score = 50;
    }

    if (score > 0) {
      results.push({ ...city, score });
    }
  }

  // Sort by score (highest first), then by name
  results.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  // Remove score and return limited results
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return results.slice(0, limit).map(({ score, ...city }) => city);
}
