import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Header from "./components/Header";
import CityTabs from "./components/CityTabs";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import CitySearchDialog from "./components/CitySearchDialog";
import { useCityStorage } from "./hooks/useCityStorage";
import "./index.css";
import type { City } from "./types/city";

const defaultCities: City[] = [
  {
    id: "3451190",
    name: "RIO DE JANEIRO",
    lat: -22.9068,
    lon: -43.1729,
    country: "Brazil",
  },
  {
    id: "1816670",
    name: "BEIJING",
    lat: 39.9042,
    lon: 116.4074,
    country: "China",
  },
  {
    id: "5368361",
    name: "LOS ANGELES",
    lat: 34.0522,
    lon: -118.2437,
    country: "United States",
  },
];

function App() {
  const { cities, addCity, removeCity } = useCityStorage(defaultCities);
  const [activeCity, setActiveCity] = useState<City>(defaultCities[0]);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const queryClient = useQueryClient();

  const refreshAllQueries = () => {
    // Invalidate all weather-related queries for all cities
    queryClient.refetchQueries({ queryKey: ["weather"] });
    queryClient.refetchQueries({ queryKey: ["hourly-forecast"] });
    queryClient.refetchQueries({ queryKey: ["daily-forecast"] });
    setLastRefreshTime(new Date());
  };

  const handleCitySelect = (selectedCity: City) => {
    addCity(selectedCity);
    setActiveCity(selectedCity);
  };

  const handleCityRemove = (cityToRemove: City) => {
    removeCity(cityToRemove);

    // If the removed city was active, switch to the first available city
    const isActiveCityRemoved = activeCity.id === cityToRemove.id;

    if (isActiveCityRemoved) {
      const remainingCities = cities.filter(
        (city) => city.id !== cityToRemove.id
      );
      if (remainingCities.length > 0) {
        setActiveCity(remainingCities[0]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onRefresh={refreshAllQueries}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <div className="max-w-5xl mx-auto px-4 pb-6 mt-3">
        <CityTabs
          cities={cities}
          activeCity={activeCity}
          onCityChange={setActiveCity}
          onCityRemove={handleCityRemove}
        />
        <div className="space-y-4 w-full">
          <CurrentWeather city={activeCity} lastRefreshTime={lastRefreshTime} />
          <HourlyForecast city={activeCity} />
          <DailyForecast city={activeCity} />
        </div>
      </div>

      <CitySearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onCitySelect={handleCitySelect}
      />
    </div>
  );
}

export default App;
