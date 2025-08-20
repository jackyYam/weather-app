import { useState, useEffect } from "react";
import type { City } from "../types/city";

const STORAGE_KEY = "weather-app-favorite-cities";

export interface StoredCity extends City {
  isFavorite?: boolean;
  isDefault?: boolean;
}

export function useCityStorage(defaultCities: City[]) {
  const [cities, setCities] = useState<StoredCity[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cities from localStorage on mount
  useEffect(() => {
    // Mark default cities
    const markedDefaultCities: StoredCity[] = defaultCities.map((city) => ({
      ...city,
      isDefault: true,
      isFavorite: false,
    }));

    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const favoriteCities: StoredCity[] = JSON.parse(stored);

        // Combine default cities with stored favorites
        const allCities = [
          ...markedDefaultCities,
          ...favoriteCities.filter(
            (favCity) =>
              !markedDefaultCities.some((defaultCity) =>
                areCitiesEqual(defaultCity, favCity)
              )
          ),
        ];
        setCities(allCities);
      } else {
        setCities(markedDefaultCities);
      }
    } catch {
      setCities(markedDefaultCities);
    }

    setIsInitialized(true);
  }, [defaultCities]);

  // Save favorite cities to localStorage whenever cities change (but not on initial load)
  useEffect(() => {
    if (!isInitialized) return;

    const favoriteCities = cities.filter(
      (city) => city.isFavorite && !city.isDefault
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteCities));
  }, [cities, isInitialized]);

  const addCity = (newCity: City) => {
    setCities((prevCities) => {
      // Check if city already exists
      const cityExists = prevCities.some((city) =>
        areCitiesEqual(city, newCity)
      );

      if (cityExists) {
        return prevCities;
      }

      // Add as favorite
      const cityToAdd: StoredCity = {
        ...newCity,
        isFavorite: true,
        isDefault: false,
      };

      return [...prevCities, cityToAdd];
    });
  };

  const removeCity = (cityToRemove: City) => {
    setCities((prevCities) =>
      prevCities.filter(
        (city) =>
          // Keep city if it's default or not the one to remove
          city.isDefault || !areCitiesEqual(city, cityToRemove)
      )
    );
  };

  const clearFavorites = () => {
    setCities((prevCities) => prevCities.filter((city) => city.isDefault));
  };

  return {
    cities,
    addCity,
    removeCity,
    clearFavorites,
  };
}

function areCitiesEqual(city1: City, city2: City): boolean {
  // If both have IDs, use ID comparison
  if (city1.id && city2.id) {
    return city1.id === city2.id;
  }

  // Fallback to name and coordinate comparison
  return (
    city1.name === city2.name &&
    Math.abs(city1.lat - city2.lat) < 0.001 &&
    Math.abs(city1.lon - city2.lon) < 0.001
  );
}
