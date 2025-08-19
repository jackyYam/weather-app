import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Header from "./components/Header";
import CityTabs from "./components/CityTabs";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import "./index.css";
import type { City } from "./types/city";

const cities = [
  {
    name: "RIO DE JANEIRO",
    lat: -22.9068,
    lon: -43.1729,
  },
  {
    name: "BEIJING",
    lat: 39.9042,
    lon: 116.4074,
  },

  {
    name: "LOS ANGELES",
    lat: 34.0522,
    lon: -118.2437,
  },
];

function App() {
  const [activeCity, setActiveCity] = useState<City>(cities[0]);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const queryClient = useQueryClient();

  const refreshAllQueries = () => {
    // Invalidate all weather-related queries for all cities
    queryClient.invalidateQueries({ queryKey: ["weather"] });
    queryClient.invalidateQueries({ queryKey: ["hourly-forecast"] });
    queryClient.invalidateQueries({ queryKey: ["daily-forecast"] });
    setLastRefreshTime(new Date());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onRefresh={refreshAllQueries} />
      <div className="max-w-5xl mx-auto px-4 pb-6 mt-3">
        <CityTabs
          cities={cities}
          activeCity={activeCity}
          onCityChange={setActiveCity}
        />
        <div className="space-y-4 w-full">
          <CurrentWeather city={activeCity} lastRefreshTime={lastRefreshTime} />
          <HourlyForecast city={activeCity} />
          <DailyForecast city={activeCity} />
        </div>
      </div>
    </div>
  );
}

export default App;
